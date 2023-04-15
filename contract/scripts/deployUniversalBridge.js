const hre = require("hardhat");
const readlineSync = require('readline-sync');
require('dotenv').config();

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Network name =", hre.network.name);
  
  let deployedAddress = "";

  const UniversalBridge = await hre.ethers.getContractFactory("UniversalBridge");

  if (hre.network.name == "goerli" || hre.network.name == "mainnet") {
    console.log("Deploying Universal Bridge Contract");

    const universalBridge = await UniversalBridge
      .connect(accounts[0])
      .deploy();
    await universalBridge.deployed();
    console.log("UniversalBridge TxHash:", universalBridge.deployTransaction.hash);

    deployedAddress = universalBridge.address;
    console.log("UniversalBridge address:", deployedAddress);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });