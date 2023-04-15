const hre = require("hardhat");
const readlineSync = require("readline-sync");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();
const Web3 = require('web3');

const bondManagerAbi = require("../artifacts/contracts/BondManager.sol/BondManager.json").abi;

const bondManagerAddress = "0xbe9B1991B6499eA6dC374ccc0553bFc04BF7a4f1";
const rootStatusManagerAddress = "0x238A3b283c6DFBfD6Aac67A735171041D9e444ec";

const main = async () => {
  const web3_goerli = new Web3(new HDWalletProvider({
    mnemonic: process.env.MNEMONIC,
    providerOrUrl: process.env.GOERLI_PROVIDER,
    chainId: 5
  }));
  const goerli_accounts = await web3_goerli.eth.getAccounts();

  const bondManagerContract = new web3_goerli.eth.Contract(bondManagerAbi, bondManagerAddress);

  let accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
  let response = await bondManagerContract.methods.addNetwork(
    80001
  ).send({ 
    from: goerli_accounts[0], 
    nonce: accountNonce 
  });
  console.log(response);

  accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
  response = await bondManagerContract.methods.addNetwork(
    534353
  ).send({ 
    from: goerli_accounts[0], 
    nonce: accountNonce 
  });
  console.log(response);

  accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
  response = await bondManagerContract.methods.addNetwork(
    1442
  ).send({ 
    from: goerli_accounts[0], 
    nonce: accountNonce 
  });
  console.log(response);

  accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
  response = await bondManagerContract.methods.addNetwork(
    59140
  ).send({ 
    from: goerli_accounts[0], 
    nonce: accountNonce 
  });
  console.log(response);

  accountNonce = await web3_goerli.eth.getTransactionCount(goerli_accounts[0]);
  response = await bondManagerContract.methods.setRootStatusManager(
    rootStatusManagerAddress
  ).send({ 
    from: goerli_accounts[0], 
    nonce: accountNonce 
  });
  console.log(response);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });