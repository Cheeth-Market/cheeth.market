import React, { useContext, useState } from "react";
import { Button } from "antd";
import {
  SymfoniContext,
  ProviderContext,
  CurrentAddressContext,
} from "../../hardhat/SymfoniContext";

function WalletButton() {
  const [constructorHasRun, setConstructorHasRun] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const defaultWalletButtonText = "Connect Wallet";
  const [currentAddress, setCurrentAddress] = useContext(CurrentAddressContext);
  const { init, currentHardhatProvider } = useContext(SymfoniContext);
  const [provider] = useContext(ProviderContext);
  
  const constructor = () => {
    if (constructorHasRun) return;
    //check if metamask is available
    if (typeof window.ethereum !== "undefined") {
      //has an ethereum provider
      setHasMetaMask(true);
      console.log("Metamask is available.");
    } else {
      //does not have an ethereum provider
      setHasMetaMask(false);
      console.error("Metamask is unavailable.");
    }

    setConstructorHasRun(true);
  };

  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      setCurrentAddress(accounts[0]);
    });

    window.ethereum.on("chainChanged", (chainId: string) => {
      console.log("reloading");
      window.location.reload();
    });
  }

  constructor();

  function formatAddressForDisplay(address: string) {
    if (!address) return defaultWalletButtonText;
    if (address.length < 36) return defaultWalletButtonText;
    return address.substring(0, 6) + "..." + address.substring(36);
  }

  return (
    <div>
      <Button
        disabled={!hasMetaMask}
        onClick={async () => {
          if (!hasMetaMask || currentAddress) return;
          init(currentHardhatProvider);
        }}
      >
        {currentAddress === "" && defaultWalletButtonText}
        {currentAddress !== "" && formatAddressForDisplay(currentAddress)}
      </Button>
    </div>
  );
}

export default WalletButton;
