// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.7.6;
pragma abicoder v2;
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract MockSwapRouter {
    // mapping (address => uint) public balanceOf;
    // function exactInput(ISwapRouter.ExactInputParams memory params)external  returns (uint256 amountOut) {
    //     amountOut = params.amountIn;
    //     balanceOf[params.recipient] += amountOut;
    // }

    address public dai;
    address public usdc;

    constructor(address _dai, address _usdc) {
        dai = _dai;
        usdc = _usdc;
    }

    function exactInput(bytes memory) external pure returns (uint256 amountOut) {
        // amountOut = params.amountIn;
        amountOut = 1000 * 10 ** 6;
    }
    // function getOwnerBalance() public view returns (uint256) {
    //     return balanceOf[msg.sender];
    // }
}