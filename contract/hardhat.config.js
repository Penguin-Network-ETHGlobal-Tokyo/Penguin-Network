require('dotenv').config();
require("hardhat-gas-reporter");
require('solidity-coverage');
require('hardhat-contract-sizer');
require("@nomicfoundation/hardhat-chai-matchers");

const mnemonic = process.env.MNEMONIC;
const goerli_provider = process.env.GOERLI_PROVIDER;
const mumbai_provider = process.env.MUMBAI_PROVIDER;
const scroll_testnet_provider = process.env.SCROLL_TESTNET_PROVIDER;
const polygon_zkevm_goerli_provider = process.env.POLYGON_ZK_EVM_GOERLI_PROVIDER;
const linea_goerli_provider = process.env.LINEA_GOERLI_PROVIDER;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    // mainnet: {
    //   url: utils.getNetwork("mainnet").provider,
    //   chainId: utils.getNetwork("mainnet").chainId,
    //   //gasPrice: 12000000000,
    //   accounts: { mnemonic },
    // },
    goerli: {
      url: goerli_provider,
      chainId: 5,
      //gasPrice: 10000000000,
      accounts: { mnemonic }
    },
    // polygon: {
    //   url: utils.getNetwork("polygon").provider,
    //   chainId: utils.getNetwork("polygon").chainId,
    //   //gasPrice: 800000000000,
    //   accounts: { mnemonic },
    // },
    mumbai: {
      url: mumbai_provider,
      chainId: 80001,
      //gasPrice: 30000000000,
      accounts: { mnemonic }
    },
    // optimism: {
    //   url: utils.getNetwork("optimism").provider,
    //   chainId: utils.getNetwork("optimism").chainId,
    //   //gasPrice: 30000000000,
    //   accounts: { mnemonic }
    // },
    // optimismGoerli: {
    //   url: utils.getNetwork("optimismGoerli").provider,
    //   chainId: utils.getNetwork("optimismGoerli").chainId,
    //   accounts: { mnemonic }
    // },
    // arbitrum: {
    //   url: utils.getNetwork("arbitrum").provider,
    //   chainId: utils.getNetwork("arbitrum").chainId,
    //   //gasPrice: 30000000000,
    //   accounts: { mnemonic }
    // },
    // arbitrumGoerli: {
    //   url: utils.getNetwork("arbitrumGoerli").provider,
    //   chainId: utils.getNetwork("arbitrumGoerli").chainId,
    //   //gasPrice: 30000000000,
    //   accounts: { mnemonic }
    // },
    scrollTestnet: {
      url: scroll_testnet_provider,
      chainId: 534353,
      //gasPrice: 30000000000,
      accounts: { mnemonic }
    },
    // zkSyncTestnet: {
    //   url: utils.getNetwork("zkSyncTestnet").provider,
    //   chainId: utils.getNetwork("zkSyncTestnet").chainId,
    //   ethNetwork: utils.getNetwork("goerli").provider, // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
    //   // zksync: true,
    //   accounts: { mnemonic }
    // },
    // baseGoerli: {
    //   url: utils.getNetwork("baseGoerli").provider,
    //   chainId: utils.getNetwork("baseGoerli").chainId,
    //   //gasPrice: 30000000000,
    //   accounts: { mnemonic },
    // },
    polygonZkEvmGoerli: {
      url: polygon_zkevm_goerli_provider,
      chainId: 1442,
      // gasPrice: 30000000000,
      accounts: { mnemonic },
    },
    lineaGoerli: {
      url: linea_goerli_provider,
      chainId: 59140,
      // gasPrice: 30000000000,
      accounts: { mnemonic },
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 21
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 300,
        details: {
          yul: true
        }
      },
    }
  }
};
