import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

function WalletButton() {
  const [constructorHasRun, setConstructorHasRun] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [provider, setProvider] = useState<Web3Provider>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  const constructor = () => {
    if (constructorHasRun) return;
    //check if metamask is available
    if (typeof window.ethereum !== "undefined") {
      //metamask available
      setHasMetaMask(true);
      console.log("Metamask is available.");
      setIsDisabled(false);
      setProvider(new ethers.providers.Web3Provider(window.ethereum));

      // detect Metamask account change
      window.ethereum.on("accountsChanged", function (newAccount: string) {
        if (newAccount && newAccount.length > 0)
          setSelectedAccount(newAccount[0]);
      });

      // detect Network account change
      window.ethereum.on("chainsChanged", function (newAccount: string) {
        if (newAccount && newAccount.length > 0)
          setSelectedAccount(newAccount[0]);
      });
    } else {
      //metamask unavailable
      setHasMetaMask(false);
      console.log("Metamask is unavailable.");
      //disable the connect button
      setIsDisabled(true);
    }

    setConstructorHasRun(true);
  };

  constructor();

  async function fetchAccount() {
    try {
      if (!account) {
        let ethAccounts = await provider?.listAccounts();
        if (ethAccounts) setSelectedAccount(ethAccounts[0]);
      }
    } catch (err) {
      setAccount("");
      setRendered("");
      console.error(err);
    }
  }

  async function setSelectedAccount(ethAddress: string) {
    if (!ethAddress || ethAddress.length <= 0) return;

    console.log("switching to selected account:");
    console.log(ethAddress);

    //format the address for display
    let displayAddress =
      ethAddress.substring(0, 6) + "..." + ethAddress.substring(36);
    setAccount(ethAddress);
    setRendered(displayAddress);
  }

  useEffect(() => {
    if (hasMetaMask && !isDisabled && provider) fetchAccount();
  });

  return (
    <Button
      disabled={isDisabled}
      onClick={async () => {
        if (!hasMetaMask) return;
        if (!provider) return;
        if (account) return;
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (!accounts || accounts.length <= 0) return;
        setSelectedAccount(accounts[0]);
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

export default WalletButton;
