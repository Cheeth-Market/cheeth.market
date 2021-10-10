import { expect} from "chai";
import { ethers } from "hardhat";

describe('NFTMarketplace', function() {

//beforeEach() hook wasn't working so...

  it('Deployment should assign the owner', async function () {
    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy();

    const [owner] = await ethers.getSigners();
    const contractOwner = await nftMarketplace.owner();

    expect(owner.address).to.equal(contractOwner);
  });

  it('Listing item then buy it then claim', async function () {
    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy();

    const testNFT = await ethers.getContractFactory('TestNFT');
    const testnft = await testNFT.deploy();

    const [owner, seller, buyer] = await ethers.getSigners();
    const testnft_address = await testnft.resolvedAddress;
    const nftMarketplace_address = await nftMarketplace.resolvedAddress;
    
    await nftMarketplace.connect(owner).pushAsset("testnft", testnft_address);
    await testnft.connect(seller).mint(2);

    expect(await testnft.ownerOf(1)).to.equal(seller.address);

    await testnft.connect(seller).approve(nftMarketplace_address, 1);
    await nftMarketplace.connect(seller).createMarketItem(testnft_address, 1, ethers.utils.parseEther("1.0"), "testnft");
    await nftMarketplace.connect(buyer).createMarketSale(1, {value: ethers.utils.parseEther("1.0")});

    expect(await testnft.ownerOf(1)).to.equal(buyer.address);
    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("1.0"));

    await nftMarketplace.connect(seller).claim();

    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("0"));
  })

  it('Listing item then cancel it', async function () {
    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy();

    const testNFT = await ethers.getContractFactory('TestNFT');
    const testnft = await testNFT.deploy();

    const [owner, seller, buyer] = await ethers.getSigners();
    const testnft_address = await testnft.resolvedAddress;
    const nftMarketplace_address = await nftMarketplace.resolvedAddress;
    
    await nftMarketplace.connect(owner).pushAsset("testnft", testnft_address);
    await testnft.connect(seller).mint(2);

    expect(await testnft.ownerOf(1)).to.equal(seller.address);

    await testnft.connect(seller).approve(nftMarketplace_address, 1);
    await nftMarketplace.connect(seller).createMarketItem(testnft_address, 1, ethers.utils.parseEther("1.0"), "testnft");

    expect(await testnft.ownerOf(1)).to.equal(nftMarketplace_address);

    await nftMarketplace.connect(seller).cancelMarketItem(1);

    expect(await testnft.ownerOf(1)).to.equal(seller.address);
  })

  it('Bid item then accept it then claim', async function () {
    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy();

    const testNFT = await ethers.getContractFactory('TestNFT');
    const testnft = await testNFT.deploy();

    const [owner, bidder, seller] = await ethers.getSigners();
    const testnft_address = await testnft.resolvedAddress;
    const nftMarketplace_address = await nftMarketplace.resolvedAddress;
    
    await nftMarketplace.connect(owner).pushAsset("testnft", testnft_address);
    await testnft.connect(seller).mint(20);
    await nftMarketplace.connect(bidder).bid(testnft_address, 3, "testnft", ethers.utils.parseEther("1.0"), 135000000, {value: ethers.utils.parseEther("1.0")});

    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("1.0"));

    await testnft.connect(seller).approve(nftMarketplace_address, 3);
    await nftMarketplace.connect(seller).acceptBid(1);

    expect(await testnft.ownerOf(3)).to.equal(bidder.address);
    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("1.0"));

    await nftMarketplace.connect(seller).claim();

    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("0"));
  })

  it('Bid item then cancel it then claim', async function () {
    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy();

    const testNFT = await ethers.getContractFactory('TestNFT');
    const testnft = await testNFT.deploy();

    const [owner, bidder, seller] = await ethers.getSigners();
    const testnft_address = await testnft.resolvedAddress;
    const nftMarketplace_address = await nftMarketplace.resolvedAddress;
    
    await nftMarketplace.connect(owner).pushAsset("testnft", testnft_address);
    await testnft.connect(seller).mint(20);
    await nftMarketplace.connect(bidder).bid(testnft_address, 3, "testnft", ethers.utils.parseEther("1.0"), 135000000, {value: ethers.utils.parseEther("1.0")});

    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("1.0"));

    await nftMarketplace.connect(bidder).cancelBid(1);
    await nftMarketplace.connect(bidder).claim();

    expect(await ethers.provider.getBalance(nftMarketplace_address)).to.equal(ethers.utils.parseEther("0"));
  })

});
