import { useCallback, useContext, useEffect, useState } from "react";
import {
    ProviderContext,
    CurrentAddressContext,
    SignerContext,
  } from "../hardhat/SymfoniContext";
import { Anonymice__factory } from "../hardhat/typechain/factories/Anonymice__factory";
import AnonymiceContractDefinition from "../external_contracts/anonymice.json"
import { formatEther } from "@ethersproject/units";

export default function useMice() {
  const [provider] = useContext(ProviderContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [value, setValue] = useState("");
  const [signer] = useContext(SignerContext);

  const fetchMice = useCallback(async () => {
    if (!provider || !signer || !currentAddress) return;
    //todo: make this flexible enough to allow for the contracts address to 
    //be located by the network the user is connected to so we can simplify testing

    // let chainId = await signer.getChainId();
    // const networkKey = chainId.toString() || "*";
    const contractAddress = AnonymiceContractDefinition.networks["*"]
    const contract = Anonymice__factory.connect(contractAddress, provider);
    const rawBalance = await contract.balanceOf(currentAddress);
    const parsedValue = parseInt(formatEther(rawBalance || 0)).toString();
    setValue(parsedValue)
    console.log(`Owner has: ${parsedValue} mice`)
  }, [provider, signer, currentAddress]);

  useEffect(() => {
    fetchMice();
  }, [fetchMice]);

  return value;
}
