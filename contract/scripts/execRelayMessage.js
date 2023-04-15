const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const Web3 = require('web3');

// Message Manager Abi
const messageManagerAbi = require("../artifacts/contracts/MessageManager.sol/MessageManager.json").abi;

// Message Manager Address
const scrollMessageManagerAddress = "0xe11733579975411fa55d162A1BE42198238D5c67";
const polygonZkEvmMessageManagerAddress = "0xd43abb96B068b6BacA043B706daB3B8f8E7C71D6";
const lineaMessageManagerAddress = "0x655518579717B17b657F45f1313db333019FE130";
const mumbaiMessageManagerAddress = "0xE0DCBC87B020f2a32907618c19662Ff4ca3024ad";

const main = async () => {
  const web3_goerli = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.GOERLI_PROVIDER,
    chainId: 5
  }));
  const web3_mumbai = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.MUMBAI_PROVIDER,
    chainId: 80001
  }));
  const web3_scroll = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.SCROLL_TESTNET_PROVIDER,
    chainId: 534353
  }));
  const web3_polygon_zk_evm = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.POLYGON_ZK_EVM_GOERLI_PROVIDER,
    chainId: 1442
  }));
  const web3_lineaGoerli = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.LINEA_GOERLI_PROVIDER,
    chainId: 59140
  }));

  const goerli_accounts = await web3_goerli.eth.getAccounts();
  const mumbai_accounts = await web3_mumbai.eth.getAccounts();
  const scroll_accounts = await web3_scroll.eth.getAccounts();
  const polygon_zk_evm_accounts = await web3_polygon_zk_evm.eth.getAccounts();
  const linea_accounts = await web3_lineaGoerli.eth.getAccounts();

  const scrollMessageManager = new web3_scroll.eth.Contract(messageManagerAbi, scrollMessageManagerAddress);
  const polygonZkEvmMessageManager = new web3_polygon_zk_evm.eth.Contract(messageManagerAbi, polygonZkEvmMessageManagerAddress);
  const lineaMessageManager = new web3_lineaGoerli.eth.Contract(messageManagerAbi, lineaMessageManagerAddress);
  const mumbaiMessageManager = new web3_mumbai.eth.Contract(messageManagerAbi, mumbaiMessageManagerAddress);

  // test scroll to polygon zkEVM

  const response = await web3_scroll.eth.call({
  to: "0xB4096Edd009eb140817D970CB3B71f132c0ccA4A",
  data: "0xd09de08a"
}, function(error, result) {
  if (!error) {
    console.log('The result is:', result);
  } else {
    console.log('Error:', error);
  }
});

  // let response = await polygonZkEvmMessageManager.methods.getMessageCount().call()
  // console.log(response);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });