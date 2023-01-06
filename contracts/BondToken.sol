// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract BondToken is ERC20, ERC20Burnable, Ownable {
	constructor() ERC20("BondToken", "BOND") {}

	function mint(address to, uint256 amount) public onlyOwner {
		_mint(to, amount);
	}
}
