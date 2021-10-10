import { useCallback, useContext, useEffect, useState } from "react";
import {
    ProviderContext,
    CurrentAddressContext,
    SignerContext,
  } from "../hardhat/SymfoniContext";
import { Cheeth__factory } from "../hardhat/typechain/factories/Cheeth__factory";
import CheethContractDefinition from "../external_contracts/cheeth.json"
import { formatEther } from "@ethersproject/units";

export default function useMice() {
  const [provider] = useContext(ProviderContext);
  const [currentAddress] = useContext(CurrentAddressContext);
  const [value, setValue] = useState("");
  const [signer] = useContext(SignerContext);

  const fetchCheeth = useCallback(async () => {
    if (!provider || !signer || !currentAddress) return;
    //todo: make this flexible enough to allow for the contracts address to 
    //be located by the network the user is connected to so we can simplify testing

    // let chainId = await signer.getChainId();
    // const networkKey = chainId.toString() || "*";
    const contractAddress = CheethContractDefinition.networks["*"]
    const contract = Cheeth__factory.connect(contractAddress, provider);
    const rawBalance = await contract.balanceOf(currentAddress);
    const parsedValue = parseFloat(formatEther(rawBalance || 0)).toPrecision(6);
    setValue(parsedValue)
    console.log(`Owner has: ${parsedValue} CHEETH`)
  }, [provider, signer, currentAddress]);

  useEffect(() => {
    fetchCheeth();
  }, [fetchCheeth]);

  return value;
}
