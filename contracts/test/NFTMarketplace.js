const { expect } = require('chai');

describe('NFTMarketplace', function () {
  it('Deployment should assign the owner', async function () {
    const [owner] = await ethers.getSigners();
    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy();
    const contractOwner = await nftMarketplace.owner();
    expect(owner.address).to.equal(contractOwner);
  });
});
