// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ReceiverEther {
   /*
    Which function is called, fallback() or receive()?

           send Ether
               |
         msg.data is empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback()
    */
  
  // function to receive Ether. msg.data must be empty
  receive() external payable {}

  // fallback function is called when msg.data is not empty
  fallback() external payable {}

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }
}

contract SendEther {
  function sendViaTransfer(address payable _to) public payable {
    // This function is no longer recomened for sending Ether
    _to.transfer(msg.value);
  }

  function sendViaSend(address payable _to) public payable {
    // Send returns a boolean value indicating success or failure.
    // This function is not recommended for sending Ether.
    bool sent = _to.send(msg.value);
    require(sent, "Failed to Send Ether");
  }

  function sendViaCall(address payable _to) public payable {
    // Call returns a boolean value indicating success or failure.
    // This is the current recommended method to use.
    (bool sent, bytes memory data) = _to.call{value: msg.value}("");
    require(sent, "Failed to send Ether");
  }
}