const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const Web3 = require('web3');

// Message Manager Abi
const incrementAbi = require("../artifacts/contracts/Increment.sol/Increment.json").abi;

// Message Manager Address
const incrementAddress = "0xB4096Edd009eb140817D970CB3B71f132c0ccA4A";

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

  const scrollIncrement = new web3_scroll.eth.Contract(incrementAbi, incrementAddress);

  // test scroll to polygon zkEVM

  const response = await scrollIncrement.methods.getCnt().call();
  console.log(response);

  const mnemonic = process.env.MNEMONIC;
  const owner = await ethers.Wallet.fromMnemonic(mnemonic);
  const ownerAddress = owner.address;

  const incrementTx = await web3_scroll.eth.sendTransaction({
    from: ownerAddress,
    to: "0xB4096Edd009eb140817D970CB3B71f132c0ccA4A",
    data: "0xd09de08a",
    gas: 200000
  });
  console.log(incrementTx);
  
  const responseAfter = await scrollIncrement.methods.getCnt().call();
  console.log(responseAfter);

  // const contractInstance = new web3_scroll.eth.Contract([], "0xB4096Edd009eb140817D970CB3B71f132c0ccA4A");

  // let response = await polygonZkEvmMessageManager.methods.getMessageCount().call()
  // console.log(response);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });