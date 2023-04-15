const hre = require("hardhat");
const readlineSync = require("readline-sync");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const Web3 = require('web3');

const bondManagerAbi = require("../artifacts/contracts/BondManager.sol/BondManager.json").abi;

const bondManagerAddress = "0xbe9B1991B6499eA6dC374ccc0553bFc04BF7a4f1";
const rootStatusManagerAddress = "0x238A3b283c6DFBfD6Aac67A735171041D9e444ec";

const mumbaiChildStatusManagerAddress = "0x06618Fac8C5131e23268FBe53adDd5DE8636C223";
const scrollChildStatusManagerAddress = "0xE0DCBC87B020f2a32907618c19662Ff4ca3024ad";
const polygonZkEvmChildStatusManagerAddress = "0xb1d4dC4552b71f016307BA1C61Ab5106c2D247D1";
const lineaChildStatusManagerAddress = "0xF4D1ad098b39DcFcE6004166dB2110083104B4D2";

const main = async () => {
  const web3_goerli = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.GOERLI_PROVIDER,
    chainId: 5
  }));
  const goerli_accounts = await web3_goerli.eth.getAccounts();

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