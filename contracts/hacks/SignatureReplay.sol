// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

/*
Signing message off-chain and having a contract that requires that signature before executing
a function is a useful technique
For example this technique is used to:
- reduce number of transaction on chain
- gas-less transaction, called meta transaction
Vulnerability: Same signature can be used multiple times to execute a function.
This can be harmful if the signer's intention was to approve a transaction once.
*/

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MultiSigWalletForSignatureReplay {
    using ECDSA for bytes32;

    address[2] public owners;

    constructor(address[2] memory _owners) payable {
        owners = _owners;
    }

    function deposit() external payable {

    }

    function transfer(address _to, uint256 _amount, bytes[2] memory _sigs) external {
        bytes32 txHash = getTxHash(_to, _amount);
        require(_checkSigs(_sigs, txHash), "invalid sig");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Falied to send Ether");
    }

    function getTxHash(address _to, uint256 _amount) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_to, _amount));
    }

    function _checkSigs(bytes[2] memory _sigs, bytes32 _txHash) private view returns (bool) {
        bytes32 ethSignedHash = _txHash.toEthSignedMessageHash();

        for(uint256 i = 0; i < _sigs.length; i++) {
            address signer = ethSignedHash.recover(_sigs[i]);
            bool valid = signer == owners[i];

            if(!valid) {
                return false;
            }
        }
        return true;
    }
}