// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// NOTE: Deploy this contract first
contract B {
  // NOTE: storage layout must be the same as contract A
  uint public num;
  address public sender;
  uint public value;

  function setVars(uint _num) public payable {
    num = _num;
    sender = msg.sender;
    value = msg.value;
  }
}

contract A {
  uint public num;
  address public sender;
  uint public value;

  bytes32 constant STORAGE_POSITION =
		keccak256("mystorage");
  
  struct StorageAddress {
    address addr;
  }

  fallback() external payable {
    StorageAddress storage ds;
    bytes32 position = STORAGE_POSITION;
		// get diamond storage
		assembly {
			ds.slot := position
		}

    address addr = ds.addr;

    assembly {
			// copy function selector and any arguments
			calldatacopy(0, 0, calldatasize())
			// execute function call using the facet
			let result := delegatecall(gas(), addr, 0, calldatasize(), 0, 0)
			// get any return value
			returndatacopy(0, 0, returndatasize())
			// return any return value or error back to the caller
			switch result
			case 0 {
				revert(0, returndatasize())
			}
			default {
				return(0, returndatasize())
			}
		}
  }

  constructor(address _addr) {
    StorageAddress storage st = getStorage();
    st.addr = _addr;
  }

  function getStorage()
		internal
		pure
		returns (StorageAddress storage ds)
	{
		bytes32 position = STORAGE_POSITION;
		assembly {
			ds.slot := position
		}
	}

  function setVarsA(address _contract, uint _num) public payable {
    
    
    // A's storage is set, B is not modified
    (bool success, bytes memory data) = _contract.delegatecall(
      abi.encodeWithSignature("setVars(uint256)", _num)
    );

    // // B's storage is set, A is not modified
    // (success, data) = _contract.call{value: 10}(
    //   abi.encodeWithSignature("setVars(uint256)", _num * 5)
    // );
  }
}