import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";
dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "http://localhost:8545";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "0x";
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "http://localhost:8545";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      // {
        // version: "0.8.24",
      // },
      {
        version:"0.7.6",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
    ethereum: {
      chainId: 1,
      url: ETHEREUM_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
    moonbase_alpha: {
      chainId: 1287,
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [SEPOLIA_PRIVATE_KEY],
    },

  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  sourcify: {
    enabled: true,
  }
};

export default config;
