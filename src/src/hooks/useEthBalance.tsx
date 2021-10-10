import { formatEther } from "ethers/lib/utils";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ProviderContext,
  CurrentAddressContext,
} from "../hardhat/SymfoniContext";

export default function useEthBalance() {
  const [provider] = useContext(ProviderContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [balance, setBalance] = useState(parseFloat("0").toPrecision(6));

  const fetchBalance = useCallback(async () => {
    if(!provider || !currentAddress) return;
    const rawBalance = await provider.getBalance(currentAddress);
    const value = parseFloat(formatEther(rawBalance || 0)).toPrecision(6);
    console.log(`${currentAddress} has ${value} ETH `)
    setBalance(value);
  }, [provider, currentAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return balance;
}
