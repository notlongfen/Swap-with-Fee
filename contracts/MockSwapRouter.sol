// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.7.6;
pragma abicoder v2;
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract MockSwapRouter {
    mapping (address => uint) public balanceOf;
    function exactInput(ISwapRouter.ExactInputParams memory params)external  returns (uint256 amountOut) {
        amountOut = params.amountIn;
        balanceOf[params.recipient] += amountOut;
    }
}