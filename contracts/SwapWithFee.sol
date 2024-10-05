// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.7.6;
pragma abicoder v2;
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';


contract SwapWithFee {
    ISwapRouter public immutable swapRouter;
    uint256 public fee = 3000; //0.3% fee
    uint256 public platformFee = 1000; //0.1% fee
    address public DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public owner;
    

    constructor(ISwapRouter _swapRouter, address _owner) {
        swapRouter = _swapRouter;   
        owner = _owner;
    }


    function swapMultipleHop(uint256 amountIn) external returns (uint256) {
        // Transfer the token to this contract
        uint256 platformFeeAmount = amountIn * platformFee / 10000;
        uint256 reward = amountIn - platformFeeAmount;
        sendOwnerFee(reward);
        TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), platformFeeAmount);  
        TransferHelper.safeApprove(DAI, address(swapRouter), platformFeeAmount);
        // Swap the token
        ISwapRouter.ExactInputParams memory params = 
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(WETH, fee, DAI, fee, USDC),
                recipient: msg.sender,
                deadline: block.timestamp + 1000,
                amountIn: platformFeeAmount,
                amountOutMinimum: 0
        });
        return swapRouter.exactInput(params);   
    }

    function sendOwnerFee(uint256 amount) public {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed.");
    }

    function getOwnerBalance() public view returns (uint256) {
        return address(this).balance;
    }

}