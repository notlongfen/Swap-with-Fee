import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "hardhat";

const PLATFORM_FEE = BigInt("3000"); // 30%
const REWARD_FEE = BigInt("1000"); // 10%

describe("Swap", function () {
  async function setUpFixture() {
    const [owner, signer, signer1] = await hre.ethers.getSigners();
    const MocKToken = await hre.ethers.getContractFactory("MockToken");
    const dai = await MocKToken.deploy("DAI", "DAI", 18);
    const usdc = await MocKToken.deploy("USDC", "USDC", 18);
    const WETH = await MocKToken.deploy("WETH", "WETH", 18);

    await dai.waitForDeployment();
    await usdc.waitForDeployment();
    await WETH.waitForDeployment();

    await usdc.mint(signer.address, ethers.parseUnits('1000000', 18));
    await WETH.mint(signer.address, ethers.parseUnits('1000000', 18));

    const MockSwapRouter = await hre.ethers.getContractFactory("MockSwapRouter");
    const swapRouter = await MockSwapRouter.deploy(await dai.getAddress(), await usdc.getAddress());
    await swapRouter.waitForDeployment();

    const Swap = await hre.ethers.getContractFactory("SwapWithFee");
    // const swap = await Swap.deploy("0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E", PLATFORM_FEE, REWARD_FEE);
    const swap = await Swap.deploy(swapRouter.getAddress(), PLATFORM_FEE, REWARD_FEE);
    await swap.waitForDeployment();

    await dai.mint(signer.address, ethers.parseUnits('1000000', 18));
    await dai.connect(signer).approve(swap.getAddress(), ethers.parseEther('1000'));

    console.log("Swap deployed to:", await swap.getAddress());
    console.log("Swap owner:", await swap.owner());
    console.log("Swap platform fee:", await swap.platformFee());
    console.log("Swap Platform fee:", PLATFORM_FEE);
    console.log("Swap reward fee:", REWARD_FEE);
    return { swap, owner, signer, signer1, dai, usdc };
  }


  it("should swap tokens", async function () {
    const { swap } = await loadFixture(setUpFixture);
    const owner = await swap.owner();
    expect(owner).to.equal(owner);

  });
  console.log(ethers.version)

  describe('Swapping Functionality', function () {
    it('Should swap tokens', async function () {
      const { swap, owner, signer, signer1, dai, usdc } = await loadFixture(setUpFixture);
      const amountIn = ethers.parseUnits('1000', 18);
      const amountOut = await swap.connect(signer).swapMultipleHop(amountIn);
      console.log("Amount in: ", amountIn);
      console.log("Amount out: ", amountOut);
      await expect(
        amountOut
      ).to.emit(swap, 'Swap')
        .withArgs(signer.address, amountIn, amountOut);

      // Check if the owner's balance is updated
      expect(await swap.getOwnerBalance()).to.equal(amountIn);
    });
    // it('Should correctly calculate platform fee and perform a mock swap', async function () {
    //   const { swap, owner, signer, signer1, dai, usdc } = await loadFixture(setUpFixture);

    //   const initialBalance = await dai.balanceOf(signer.address);
    //   console.log("Initial balance: ", initialBalance.toString());
    //   expect(initialBalance).to.equal(ethers.parseUnits('1000000', 18));
    //   const amountIn = ethers.parseUnits('1000', 18);
    //   const platformFeeAmount = (amountIn * PLATFORM_FEE) / BigInt(10000);
    //   console.log("Calculated platform fee amount: ", platformFeeAmount.toString());


    //   await expect(swap.connect(signer).swapMultipleHop(amountIn))
    //     .to.emit(swap, 'Swap')
    //     .withArgs(signer.address, ethers.parseUnits('1000', 18), ethers.parseUnits('1000', 18));

    //   const finalDaiBalance = await dai.balanceOf(signer.address);
    //   console.log("Final balance: ", finalDaiBalance.toString());
    //   const finalUSDCBalance = await usdc.balanceOf(signer.address);
    //   console.log("Final balance: ", finalUSDCBalance.toString());

    //   expect(finalDaiBalance).to.be.equal(initialBalance - ethers.parseUnits('1000', 18));

    //   expect(finalUSDCBalance).to.be.greaterThan(0);
    //   // const amountIn = ethers.parseUnits('1000', 18);
    //   // const platformFeeAmount = amountIn * PLATFORM_FEE / BigInt(10000);
    //   // const reward = amountIn - platformFeeAmount;

    //   // // Mock transferring the platform fee amount to the contract
    //   // const amountOut = await swap.connect(signer1).swapMultipleHop(amountIn, { value: platformFeeAmount })
    //   // console.log("Amount in: ", amountIn);
    //   // console.log("Amount out: ", amountOut);
    //   // await expect(
    //   //   amountOut
    //   // ).to.emit(swap, 'Swap')
    //   //   .withArgs(signer1, amountIn, amountOut);

    //   // // Check if the owner's balance is updated
    //   // expect(await swap.getOwnerBalance()).to.equal(reward);
    // });

    // it('Should revert swap if insufficient balance', async function () {
    //   const { swap, owner, signer, signer1 } = await loadFixture(setUpFixture);
    //   const amountIn = ethers.parseUnits('1000', 18);
    //   await expect(swap.connect(signer).swapMultipleHop(amountIn))
    //     .to.be.revertedWith('Insufficient balance');
    // });
  });
})