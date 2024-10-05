import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Swap", function() {
  async function setUpFixture(){
    const Swap = await hre.ethers.getContractFactory("SwapWithFee");
    const swap = await Swap.deploy("0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E", process.env.SEPOLIA_ADDRESS || "");
    await swap.waitForDeployment();
    return { swap };
  }


  it("should swap tokens", async function() {
    const { swap } = await loadFixture(setUpFixture);
    const owner = await swap.owner();
    expect(owner).to.equal(process.env.SEPOLIA_ADDRESS);
    
  });
})