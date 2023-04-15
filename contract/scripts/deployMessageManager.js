const hre = require("hardhat");
const readlineSync = require('readline-sync');
require('dotenv').config();

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Network name =", hre.network.name);
  
  let deployedAddress = "";

  const MessageManager = await hre.ethers.getContractFactory("MessageManager");

  console.log("Deploying Message Manager Contract");

  const messageManager = await MessageManager
    .connect(accounts[0])
    .deploy();
  await messageManager.deployed();
  console.log("MessageManager TxHash:", messageManager.deployTransaction.hash);

  deployedAddress = messageManager.address;
  console.log("MessageManager address:", deployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });