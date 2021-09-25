// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 Forked from https://gist.github.com/dabit3/52e818faa83449bb5303cb868aee78f5
 */

contract NFT {
    function ownerOf(uint256 tokenId) public returns (address) {}
}

contract NFTMarketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemCanceled;
    Counters.Counter private _BidId;

    struct Bid {
        uint256 BidId;
        string assetType;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        uint256 expirationBlock;
        address payable bider;
        bool available;
    }

    struct MarketItem {
        uint256 itemId;
        string assetType;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool available;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Bid) private bidIdtoBid;
    mapping(string => address) private allowedAsset;
    mapping(address => uint256) public claimableEth;

    event MarketBid(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 BidId,
        string assetType,
        uint256 price,
        address bider,
        uint256 expirationBlock
    );

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        string assetType,
        address seller,
        address owner,
        uint256 price
    );

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function pushAsset(string memory assetType, address nftContract) public onlyOwner{
        allowedAsset[assetType] = nftContract;
    }

    function getMarketItem(uint256 marketItemId)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[marketItemId];
    }

    //List an item
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string memory assetType
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(allowedAsset[assetType] == nftContract, "Asset not valid");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            assetType,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            true
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            assetType,
            msg.sender,
            address(0),
            price
        );
    }

    //Cancel a listing
    function cancelMarketItem(uint256 itemId) public payable nonReentrant {
        require(
            idToMarketItem[itemId].seller == msg.sender,
            "You don't own this token"
        );

        IERC721(idToMarketItem[itemId].nftContract).transferFrom(
            address(this),
            msg.sender,
            idToMarketItem[itemId].tokenId
        );

        idToMarketItem[itemId].available = false;
        _itemCanceled.increment();
    }

    //Buy an item
    function createMarketSale(uint256 itemId) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        payable(address(this)).transfer(msg.value);
        claimableEth[idToMarketItem[itemId].seller] += msg.value;

        IERC721(idToMarketItem[itemId].nftContract).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].available = false;
        _itemsSold.increment();
    }

    //Bid an item
    function bid(
        address nftContract,
        uint256 tokenId,
        string memory assetType,
        uint256 price,
        uint256 expirationBlock,
        address payable bider,
        bool available
    ) public payable nonReentrant {
        require(price == msg.value, "Not enaugh funds");
        require(allowedAsset[assetType] == nftContract, "Asset not valid");
        uint256 BidId = _BidId.current();
        bidIdtoBid[BidId] = Bid(
            BidId,
            assetType,
            nftContract,
            tokenId,
            price,
            expirationBlock,
            payable(msg.sender),
            true
        );

        emit MarketBid(
            nftContract,
            tokenId,
            BidId,
            assetType,
            price,
            bider,
            expirationBlock
        );

        _BidId.increment();
    }

    // Accept bid
    function acceptBid(uint256 BidId) public payable nonReentrant {
        NFT nft = NFT(bidIdtoBid[BidId].nftContract);
        require(
            msg.sender ==
                nft.ownerOf(
                    bidIdtoBid[BidId].tokenId
                ),
            "You don't own this token"
        );
        require(bidIdtoBid[BidId].available == true, "Expired bid");
        require(
            block.number < bidIdtoBid[BidId].expirationBlock,
            "Expired bid"
        );

        IERC721(bidIdtoBid[BidId].nftContract).transferFrom(
            msg.sender,
            bidIdtoBid[BidId].bider,
            bidIdtoBid[BidId].tokenId
        );

        claimableEth[msg.sender] += bidIdtoBid[BidId].price;
        bidIdtoBid[BidId].available = false;
    }

    //Cancel bid
    function cancelBid(uint256 BidId) public nonReentrant {
        require(msg.sender == bidIdtoBid[BidId].bider, "Not your bid");
        require(bidIdtoBid[BidId].available == true, "Expired bid");

        claimableEth[msg.sender] += bidIdtoBid[BidId].price;
        bidIdtoBid[BidId].available = false;
    }

    //Claim user's eth
    function claim() public payable nonReentrant {
        payable(msg.sender).transfer(claimableEth[msg.sender]);
        claimableEth[msg.sender] = 0;
    }

    //Returns all unsold items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() -
            _itemsSold.current() -
            _itemCanceled.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].available == true) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    //Returns msg.sender's items bought
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}
