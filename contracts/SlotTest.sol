// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract SlotTest {
  struct MyStruct {
    uint256 value;
  }

  // struct stored at slot 0
  MyStruct public s0 = MyStruct(123);
  // struct stored at slot 1
  MyStruct public s1 = MyStruct(456);
  // struct stored at slot 2
  MyStruct public s2 = MyStruct(789);

  function _get(uint256 i) internal pure returns (MyStruct storage s) {
    // get struct stored at slot i
    assembly {
      s.slot := i
    }
  }

  function get(uint256 i) external view returns (uint256) {
    return _get(i).value;
  }

  function set(uint256 i, uint256 x) external {
    _get(i).value = x;
  }
}