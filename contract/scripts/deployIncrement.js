const hre = require("hardhat");
const readlineSync = require('readline-sync');
require('dotenv').config();

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Network name =", hre.network.name);
  
  let deployedAddress = "";

  const Increment = await hre.ethers.getContractFactory("Increment");

  console.log("Deploying Increment Contract");

  const increment = await Increment
    .connect(accounts[0])
    .deploy();
  await increment.deployed();
  console.log("Increment TxHash:", increment.deployTransaction.hash);

  deployedAddress = increment.address;
  console.log("Increment address:", deployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });