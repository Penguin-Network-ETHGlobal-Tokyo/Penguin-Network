const hre = require("hardhat");
const readlineSync = require('readline-sync');
require('dotenv').config();

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Network name =", hre.network.name);
  
  let deployedAddress = "";

  const RootStatusManager = await hre.ethers.getContractFactory("RootStatusManager");
  const ChildStatusManager = await hre.ethers.getContractFactory("ChildStatusManager");
  const rootStatusManagerAddress = "0xFe335078B3890b35A9fCB803a4Cb6c585f36a3EC";

  if (hre.network.name == "goerli" || hre.network.name == "mainnet") {
    console.log("Deploying Root Status Manager Contract");

    const rootStatusManager = await RootStatusManager
      .connect(accounts[0])
      .deploy("0x1276ce12eC4077caFED34F2EbCe68000e5Ad76E2");
    await rootStatusManager.deployed();
    console.log("RootStatusManager TxHash:", rootStatusManager.deployTransaction.hash);

    deployedAddress = rootStatusManager.address;
    console.log("RootStatusManager address:", deployedAddress);
    return;
  }

  console.log("RootStatusManager address:", rootStatusManagerAddress);
  let networkId = 0;
  if (hre.network.name == "scrollTestnet") {
    networkId = 534353;
  } else if (hre.network.name == "polygonZkEvmGoerli") {
    networkId = 1442;
  } else if (hre.network.name == "lineaGoerli") {
    networkId = 59140;
  } else if (hre.network.name == "mumbai") {
    networkId = 80001;
  } else {
    console.log("Not Support Network");
    return;
  }

  console.log("Deploying Child Status Manager Contract");
  const childStatusManager = await ChildStatusManager
    .connect(accounts[0])
    .deploy(networkId, rootStatusManagerAddress);
  await childStatusManager.deployed();
  console.log("ChildStatusManager TxHash:", childStatusManager.deployTransaction.hash);

  deployedAddress = childStatusManager.address;
  console.log("ChildStatusManager address:", deployedAddress);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
