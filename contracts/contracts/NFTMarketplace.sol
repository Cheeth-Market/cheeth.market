// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
    Counters.Counter private _tradeId;
    Counters.Counter private _claimId;

    enum Status {
        Available,
        Sold,
        Canceled,
        Accepted
    }

    enum Tradetype {
        Listing,
        Buy,
        Cancel,
        Bid,
        Accept,
        Claim
    }

    struct Bid {
        uint256 BidId;
        string assetType;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        uint256 expirationBlock;
        address payable bidder;
        Status status;
    }

    struct MarketItem {
        uint256 itemId;
        string assetType;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        Status status;
    }

    struct Claim {
        uint256 claimId;
        uint256 amount;
        address from;
    }

    struct Trade {
        uint256 tradeId;
        Tradetype trade;
        uint256 typeId;
        address from;
        uint256 blockNum;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => Bid) private bidIdtoBid;
    mapping(uint256 => Trade) private tradeIdtoTrade;
    mapping(uint256 => Claim) private claimIdtoClaim;
    mapping(string => address) private allowedAsset;
    mapping(address => uint256) private claimableEth;

    event MarketBid(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 indexed BidId,
        string assetType,
        uint256 price,
        address bidder,
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

    fallback() external payable {
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
    ) public nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(allowedAsset[assetType] == nftContract, "Asset not valid");

        _itemIds.increment();
        _tradeId.increment();

        uint256 itemId = _itemIds.current();
        uint256 tradeId = _tradeId.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            assetType,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            Status.Available
        );

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Listing,
            itemId,
            msg.sender,
            block.number
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
    function cancelMarketItem(uint256 itemId) public nonReentrant {
        require(
            idToMarketItem[itemId].seller == msg.sender,
            "You don't own this token"
        );

        _itemCanceled.increment();
        _tradeId.increment();

        uint256 tradeId = _tradeId.current();

        IERC721(idToMarketItem[itemId].nftContract).transferFrom(
            address(this),
            msg.sender,
            idToMarketItem[itemId].tokenId
        );

        idToMarketItem[itemId].status = Status.Canceled;

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Cancel,
            itemId,
            msg.sender,
            block.number
        );
    }

    //Buy an item
    function createMarketSale(uint256 itemId) public payable nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        require(idToMarketItem[itemId].status == Status.Available, "Asset not available");

        payable(address(this)).transfer(msg.value);
        claimableEth[idToMarketItem[itemId].seller] += msg.value;

        _itemsSold.increment();
        _tradeId.increment();

        uint256 tradeId = _tradeId.current();

        IERC721(idToMarketItem[itemId].nftContract).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Buy,
            itemId,
            msg.sender,
            block.number
        );

        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].status = Status.Sold;
    }

    //Bid an item
    function bid(
        address nftContract,
        uint256 tokenId,
        string memory assetType,
        uint256 price,
        uint256 expirationBlock
    ) public payable nonReentrant {
        require(price == msg.value, "Not enaugh funds");
        require(allowedAsset[assetType] == nftContract, "Asset not valid");

        _BidId.increment();
        _tradeId.increment();

        uint256 BidId = _BidId.current();
        uint256 tradeId = _tradeId.current();

        bidIdtoBid[BidId] = Bid(
            BidId,
            assetType,
            nftContract,
            tokenId,
            price,
            expirationBlock,
            payable(msg.sender),
            Status.Available
        );

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Bid,
            BidId,
            msg.sender,
            block.number
        );

        emit MarketBid(
            nftContract,
            tokenId,
            BidId,
            assetType,
            price,
            msg.sender,
            expirationBlock
        );
    }

    // Accept bid
    function acceptBid(uint256 BidId) public nonReentrant {
        NFT nft = NFT(bidIdtoBid[BidId].nftContract);
        require(
            msg.sender ==
                nft.ownerOf(
                    bidIdtoBid[BidId].tokenId
                ),
            "You don't own this token"
        );
        require(bidIdtoBid[BidId].status == Status.Available, "Bid not available");
        require(
            block.number < bidIdtoBid[BidId].expirationBlock,
            "Expired bid"
        );

        _tradeId.increment();

        uint256 tradeId = _tradeId.current();

        IERC721(bidIdtoBid[BidId].nftContract).transferFrom(
            msg.sender,
            bidIdtoBid[BidId].bidder,
            bidIdtoBid[BidId].tokenId
        );

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Accept,
            BidId,
            msg.sender,
            block.number
        );

        claimableEth[msg.sender] += bidIdtoBid[BidId].price;
        bidIdtoBid[BidId].status = Status.Accepted;
    }

    //Cancel bid
    function cancelBid(uint256 BidId) public nonReentrant {
        require(msg.sender == bidIdtoBid[BidId].bidder, "Not your bid");
        require(bidIdtoBid[BidId].status == Status.Available, "Expired bid");

        _tradeId.increment();

        uint256 tradeId = _tradeId.current();

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Cancel,
            BidId,
            msg.sender,
            block.number
        );

        claimableEth[msg.sender] += bidIdtoBid[BidId].price;
        bidIdtoBid[BidId].status = Status.Canceled;
    }

    //Claim user's eth
    function claim() public payable nonReentrant {
        payable(msg.sender).transfer(claimableEth[msg.sender]);

        _tradeId.increment();
        _claimId.increment();

        uint256 tradeId = _tradeId.current();
        uint256 claimId = _claimId.current();

        claimIdtoClaim[claimId] = Claim(
            claimId,
            claimableEth[msg.sender],
            msg.sender
        );

        tradeIdtoTrade[tradeId] = Trade(
            tradeId,
            Tradetype.Claim,
            claimId,
            msg.sender,
            block.number
        );

        claimableEth[msg.sender] = 0;
    }

    function tradeHistory(address user) public view returns(Trade[] memory) {
        uint256 tradeId = _tradeId.current();
        uint256 tradeNum = 0;

        for (uint256 i = 0; i <= tradeId; i++) {
            if (tradeIdtoTrade[tradeId].from == user) {
                tradeNum++;
            }
        }

        Trade[] memory trades = new Trade[] (tradeNum);
        for (uint256 i = 0; i <= tradeId; i++) {
            if (tradeIdtoTrade[tradeId].from == user) {
                trades[i] = tradeIdtoTrade[tradeId];
            }
        }

        return trades;
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
            if (idToMarketItem[i + 1].status == Status.Available) {
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
