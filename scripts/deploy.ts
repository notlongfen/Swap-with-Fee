import { ethers } from "hardhat";

async function main() {
    const contractFactory = await ethers.getContractFactory("SwapWithFee");
    const contract = await contractFactory.deploy("0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E", process.env.SEPOLIA_ADDRESS || "");   
    await contract.waitForDeployment();
    console.log("Contract deployed to address:", await contract.getAddress());
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});