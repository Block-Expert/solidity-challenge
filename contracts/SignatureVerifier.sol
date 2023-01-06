// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureVerifier {
  using ECDSA for bytes32;

  address public signer;
  mapping(bytes => bool) private _usedHash;

  constructor(address _signer) {
    signer = _signer;
  }

  function getSigner() external view returns (address) {
    return signer;
  }

  function setSigner(address _signer) external {
    signer = _signer;
  }

  function verify(uint256 param, bytes memory signature, uint256 nonce) external {
    verifySignature(param, signature, nonce);

    _usedHash[signature] = true;
  }

  function verifySignature(uint256 param, bytes memory signature, uint256 nonce) internal view {
    require(_usedHash[signature] == false, "SignatureVerifier: already used signature");
    require(
      keccak256(abi.encodePacked(param, nonce)).toEthSignedMessageHash().recover(signature) == signer, "SignatureVerifier: invalid signature"
    );
  }
}