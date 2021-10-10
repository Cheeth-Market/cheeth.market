import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import DummyGrid from "./DummyGrid";
import useTestNFT from "../../hooks/useTestNFT";
import { CurrentAddressContext } from "../../hardhat/SymfoniContext";
import { BigNumber } from "@ethersproject/bignumber";

function ForSaleWrapper() {
  const [currentAddress] = useContext(CurrentAddressContext);
  const { mint, fetch, getBalance } = useTestNFT();
  const [usersTestNfts, setUsersTestNfts] = useState<BigNumber[]>();

  // useEffect(() => {
  //   fetchNfts();
  // }, [fetchNfts]);

  const fetchTestNftsTokensOwnedByUser = async () => {
    const nfts = await fetch();
    if (!nfts) {
      console.log("User doesn't have any TestNFTs");
      return;
    }
    console.log(`User has ${nfts.length} TestNFTs`);
    setUsersTestNfts(nfts);
  };

  return (
    <>
      <Button onClick={mint}>{currentAddress === "" ? "" : "MINT"}</Button>
      <Button onClick={fetchTestNftsTokensOwnedByUser}>
        {currentAddress === "" ? "" : "FETCH"}
      </Button>
      
      {usersTestNfts ? usersTestNfts.length.toString() : ""}
      {usersTestNfts?.map((nftTokenId) => (
        <>
          <div key={nftTokenId.toString()}>{nftTokenId.toString()}</div>
          
        </>
      ))}

      {/* <DummyGrid /> */}
    </>
  );
}

export default ForSaleWrapper;
