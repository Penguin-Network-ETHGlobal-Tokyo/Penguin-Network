const hre = require("hardhat");
const readlineSync = require('readline-sync');
require('dotenv').config();

const mnemonic = process.env.MNEMONIC;

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Network name =", hre.network.name);
  const owner = await ethers.Wallet.fromMnemonic(mnemonic);
  const ownerAddress = owner.address;
  console.log("ownerAddress =", ownerAddress);
  
  let deployedAddress = "";

  const BondManager = await hre.ethers.getContractFactory("BondManager");

  if (hre.network.name == "goerli" || hre.network.name == "mainnet") {
    console.log("Deploying Bond Manager Contract");

    const bondManager = await BondManager
      .connect(accounts[0])
      .deploy(ownerAddress);
    await bondManager.deployed();
    console.log("BondManager TxHash:", bondManager.deployTransaction.hash);

    deployedAddress = bondManager.address;
    console.log("BondManager address:", deployedAddress);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });