import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@typechain/hardhat";
import "@typechain/ethers-v5";
import "@symfoni/hardhat-react";



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  paths: {
    "react": "../src/src/hardhat",
    "deployments": "../src/src/hardhat/deployments"
  },
  typechain: {
    outDir: "../src/src/hardhat/typechain",
    target: "ethers-v5",
    externalArtifacts: ["./external_contracts/*.json"]
  },
  react: {
    providerPriority: ["web3modal", "hardhat"],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: "test test test test test test test test test test test junk", // test test test test test test test test test test test junk
      }
      // accounts: [
      //   {
      //     "privateKey": "0x2910401e6a570614db2997b256d180550dc0dae64f0ae8f75a02e9d20d87e053",
      //     "balance": "100000000000000000000"
      //   }
      // ]
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
};
export default config;