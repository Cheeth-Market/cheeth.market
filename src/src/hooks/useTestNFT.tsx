import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { useContext, useState } from "react";
import {
  CurrentAddressContext,
  SignerContext,
  TestNFTContext,
} from "../hardhat/SymfoniContext";
export default function useTestNFT() {
  
  const [signer] = useContext(SignerContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const testNftContractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  const testNftContext = useContext(TestNFTContext);
  const testNft = testNftContext.instance?.attach(testNftContractAddress);  
    
  const mint = async function () {
    if (!signer || !testNft) return;
    var tx = await testNft.mint(5)
    console.log(tx);
    const txs = await tx?.wait();
    console.log("tx complete:", txs);
    // const name = await testNft.name()
    // console.log('contract name: ' + name);
  };

  const fetch = async function () {
    if (!signer || !testNft) return;
    const tokenBalance = await testNft.balanceOf(currentAddress);
    const numberOfTokens = tokenBalance.toNumber();
    const tokens = [];
    for(let i = 0; i < numberOfTokens; i++) {
      const tokenIndex = await testNft.tokenOfOwnerByIndex(currentAddress, i)
      tokens.push(tokenIndex);
    }
    return tokens;
  };

  const getBalance = async function () {
    if (!signer || !testNft) return;
    const tokenBalance = await testNft.balanceOf(currentAddress);
    console.log('Balance for ' + currentAddress + ' is ' + tokenBalance)
    console.log(tokenBalance)
    return tokenBalance;
  };

  return {mint, fetch, getBalance};
}
