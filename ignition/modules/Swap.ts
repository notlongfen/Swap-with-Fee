// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const LockModule = buildModule("SwapWithFeeModule", (m) => {
  const owner = process.env.SEPOLIA_ADDRESS || "";
  const swapContract = m.contract("SwapWithFee", ["0x89031Ff7240456b4997e367b48eDED3415606e0D", owner]);

  return { swapContract };
});

export default LockModule;
