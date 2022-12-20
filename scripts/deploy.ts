import { ethers } from "hardhat";

async function main() {
  const FractionalNFTPool = await ethers.getContractFactory("FractionalNFTPool");
  const fractionalNFTPool = await FractionalNFTPool.deploy();

  await fractionalNFTPool.deployed();

  console.log(fractionalNFTPool.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
