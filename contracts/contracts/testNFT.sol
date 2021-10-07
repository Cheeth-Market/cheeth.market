// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract testNFT is ERC721Enumerable {

    constructor () ERC721("NFTfortests", "TEST") {
    }

    function mint(uint256 _mintAmount) public {
        uint256 supply = totalSupply();

        for (uint256 i = 1; i <= _mintAmount; i++) {
          _safeMint(msg.sender, supply + i);
        }
  }
}