// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 Forked from https://gist.github.com/dabit3/52e818faa83449bb5303cb868aee78f5
 */

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemCanceled;
    Counters.Counter private _BidId;

    struct Bid {
        uint256 BidId;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        uint256 expirationBlock;
        address payable bider;
        bool available;
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool available;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Bid) private bidIdtoBid;
    mapping(address => uint256) public claimableEth;

    event MarketBid(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 BidId,
        uint256 price,
        address bider,
        uint256 expirationBlock
    );

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
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
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
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
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        payable(address(this)).transfer(msg.value);
        claimableEth[idToMarketItem[itemId].seller] += msg.value;
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].available = false;
        _itemsSold.increment();
    }

    //Bid an item
    function bid(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 expirationBlock,
        address payable bider,
        bool available
    ) public payable nonReentrant {
        require(price == msg.value, "Not enaugh funds");
        bidIdtoBid[BidId] = Bid(
            BidId,
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
            price,
            bider,
            expirationBlock
        );
        BidId.increment();
    }

    //Accept bid
    function acceptBid(uint256 BidId) public payable nonReentrant {
        require(
            msg.sender ==
                bidIdtoBid[BidId].nftContract.ownerOf(
                    bidIdtoBid[BidId].tokenId
                ),
            "You don't own this token"
        );
        require(bidIdtoBid[BidId].available == true, "Expired bid");

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
