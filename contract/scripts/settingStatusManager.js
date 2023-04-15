const hre = require("hardhat");
const readlineSync = require("readline-sync");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const Web3 = require('web3');

const rootStatusManagerAbi = require("../artifacts/contracts/StatusManager/RootStatusManager.sol/RootStatusManager.json").abi;
const childStatusManagerAbi = require("../artifacts/contracts/StatusManager/ChildStatusManager.sol/ChildStatusManager.json").abi;

const bondManagerAddress = "0xbe9B1991B6499eA6dC374ccc0553bFc04BF7a4f1";
const rootStatusManagerAddress = "0x238A3b283c6DFBfD6Aac67A735171041D9e444ec";

const mumbaiChildStatusManagerAddress = "0x06618Fac8C5131e23268FBe53adDd5DE8636C223";
const scrollChildStatusManagerAddress = "0xE0DCBC87B020f2a32907618c19662Ff4ca3024ad";
const polygonZkEvmChildStatusManagerAddress = "0xb1d4dC4552b71f016307BA1C61Ab5106c2D247D1";
const lineaChildStatusManagerAddress = "0xF4D1ad098b39DcFcE6004166dB2110083104B4D2";

const mumbaiMessageManagerAddress = "0xeDFbf3399088eEe159281fd1B5Cd1760a669cf95";
const scrollMessageManagerAddress = "0xBf36C732926de8D23264Cb5d5a62b57912ba2544";
const polygonZkEvmMessageManagerAddress = "0x35E971D87476fDF85733013a26B3a70bb9aa7025";
const lineaMessageManagerAddress = "0xBffEc066627fb3D002f7584275Ab3d78944aFf0c";

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

  const env = readlineSync.question("L1 or L2? [1/2]");
  if (env == "L1" || env == "1"){
    const rootContract = new web3_goerli.eth.Contract(rootStatusManagerAbi, rootStatusManagerAddress);

    // setting for mumbai
    console.log("Setting mumbai address");
    accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
    response = await rootContract.methods.setChildStatusManagers(
      80001,
      mumbaiChildStatusManagerAddress
    ).send({ 
      from: goerli_accounts[0], 
      nonce: accountNonce 
    });
    console.log(response);

    // setting for scroll
    console.log("Setting scroll address");
    accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
    response = await rootContract.methods.setChildStatusManagers(
      534353,
      scrollChildStatusManagerAddress
    ).send({ 
      from: goerli_accounts[0], 
      nonce: accountNonce 
    });
    console.log(response);

    // setting for polygonZkEvmGoerli
    console.log("Setting polygon zkEVM address");
    accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
    response = await rootContract.methods.setChildStatusManagers(
      1442,
      polygonZkEvmChildStatusManagerAddress
    ).send({ 
      from: goerli_accounts[0], 
      nonce: accountNonce 
    });
    console.log(response);

    // setting for linea
    console.log("Setting linea address");
    accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
    response = await rootContract.methods.setChildStatusManagers(
      59140,
      lineaChildStatusManagerAddress
    ).send({ 
      from: goerli_accounts[0], 
      nonce: accountNonce 
    });
    console.log(response);

    // setting for bondManager
    console.log("Setting bond manager address");
    accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
    response = await rootContract.methods.setBondManagerAddress(
      bondManagerAddress
    ).send({ 
      from: goerli_accounts[0], 
      nonce: accountNonce 
    });
    console.log(response);
  } else if (env == "L2" || env == "2"){
    const env = readlineSync.question("Mumbai, Scroll, PolygonZkEvm, or Linea?: [m/s/z/l]");
    if (env == "mumbai" || env == "m") {
      const childContract = new web3_mumbai.eth.Contract(childStatusManagerAbi, mumbaiChildStatusManagerAddress);
      accountNonce = await web3_mumbai.eth.getTransactionCount(mumbai_accounts[0]);
      response = await childContract.methods.setBridgeAddress(
        mumbaiMessageManagerAddress
      ).send({ 
        from: mumbai_accounts[0], 
        nonce: accountNonce 
      });
      console.log(response);
    } else if (env == "scroll" || env == "s") {
      const childContract = new web3_scroll.eth.Contract(childStatusManagerAbi, scrollChildStatusManagerAddress);
      accountNonce = await web3_scroll.eth.getTransactionCount(scroll_accounts[0]);
      response = await childContract.methods.setBridgeAddress(
        scrollMessageManagerAddress
      ).send({ 
        from: scroll_accounts[0], 
        nonce: accountNonce 
      });
      console.log(response);
    } else if (env == "zkEvm" || env == "z") {
      const childContract = new web3_polygon_zk_evm.eth.Contract(childStatusManagerAbi, polygonZkEvmChildStatusManagerAddress);
      accountNonce = await web3_polygon_zk_evm.eth.getTransactionCount(polygon_zk_evm_accounts[0]);
      response = await childContract.methods.setBridgeAddress(
        polygonZkEvmMessageManagerAddress
      ).send({ 
        from: polygon_zk_evm_accounts[0], 
        nonce: accountNonce 
      });
      console.log(response);
    } else if (env == "linea" || env == "l") {
      const childContract = new web3_lineaGoerli.eth.Contract(childStatusManagerAbi, lineaChildStatusManagerAddress);
      accountNonce = await web3_lineaGoerli.eth.getTransactionCount(linea_accounts[0]);
      response = await childContract.methods.setBridgeAddress(
        lineaMessageManagerAddress
      ).send({ 
        from: linea_accounts[0], 
        nonce: accountNonce 
      });
      console.log(response);
    }
  } else {
    console.log("invalid input")
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });