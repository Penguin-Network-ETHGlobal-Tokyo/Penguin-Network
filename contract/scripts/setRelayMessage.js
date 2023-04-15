const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const Web3 = require('web3');

// Message Manager Abi
const messageManagerAbi = require("../artifacts/contracts/MessageManager.sol/MessageManager.json").abi;

// Message Manager Address
const scrollMessageManagerAddress = "0xBf36C732926de8D23264Cb5d5a62b57912ba2544";
const polygonZkEvmMessageManagerAddress = "0x35E971D87476fDF85733013a26B3a70bb9aa7025";
const lineaMessageManagerAddress = "0xBffEc066627fb3D002f7584275Ab3d78944aFf0c";
const mumbaiMessageManagerAddress = "0xeDFbf3399088eEe159281fd1B5Cd1760a669cf95";

const main = async () => {
  const web3_goerli = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: "https://eth-goerli.g.alchemy.com/v2/NX9gTxVdfvE_84VU2Hr60L-jLEK_gpsa",
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

  const scrollEncodedMessage = await web3_scroll.eth.abi.encodeFunctionCall({
    name: 'increment',
    type: 'function',
    inputs: []
  }, []);
  console.log("ScrollEncodedMessage", scrollEncodedMessage);

  const polygonZkEvmGoerliEncodedMessage = await web3_polygon_zk_evm.eth.abi.encodeFunctionCall({
    name: 'increment',
    type: 'function',
    inputs: []
  }, []);
  console.log("Polygon zkEVM encodedMessage", polygonZkEvmGoerliEncodedMessage);

  const lineaEncodedMessage = await web3_lineaGoerli.eth.abi.encodeFunctionCall({
    name: 'increment',
    type: 'function',
    inputs: []
  }, []);
  console.log("LineaEncodedMessage", lineaEncodedMessage);

  const mumbaiEncodedMessage = await web3_mumbai.eth.abi.encodeFunctionCall({
    name: 'increment',
    type: 'function',
    inputs: []
  }, []);
  console.log("mumbaiEncodedMessage", mumbaiEncodedMessage);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });