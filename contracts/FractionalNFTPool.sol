// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./BondToken.sol";

contract FractionalNFTPool {
	struct Pool {
		address bondTokenAddress;
		address[] owners;
		uint256 nftPrice;
	}

	mapping(address => mapping(uint256 => Pool)) public pools;

	/// @dev 0xd5a82115
	error AlreadyDeposited();
	/// @dev 0x6a542812
	error NotDepositedYet();
	/// @dev 0xf7760f25
	error WrongPrice();

	function depositNFT(
		address _nftAddress,
		uint256 _tokenId,
		uint256 _nftPrice,
		uint256 _totalFractionalTokens
	) external {
		Pool storage pool = pools[_nftAddress][_tokenId];
		if (pool.bondTokenAddress != address(0)) revert AlreadyDeposited();
		//require(pool.bondTokenAddress == address(0), "AlreadyDeposited");

		// Create a ERC20 Token Contract for the dposited NFT
		address[] memory owners = new address[](1);
		owners[0] = msg.sender;

		BondToken bondToken = (new BondToken)(); //initialize
		pools[_nftAddress][_tokenId] = Pool({
			bondTokenAddress: address(bondToken),
			owners: owners,
			nftPrice: _nftPrice
		});

		ERC721(_nftAddress).safeTransferFrom(
			msg.sender,
			address(this),
			_tokenId
		);
		bondToken.mint(msg.sender, _totalFractionalTokens * 10**18); //now mint the fractional tokens and send it to the owner of this NFT
	}

	function claimNFT(
		address _nftAddress,
		uint256 _tokenId,
		uint256 _amountBondToken
	) external {
		Pool storage pool = pools[_nftAddress][_tokenId];
		if (pool.bondTokenAddress == address(0)) revert NotDepositedYet();
		BondToken bondToken = BondToken(pool.bondTokenAddress);
		if (_amountBondToken * 10**18 != bondToken.totalSupply())
			revert WrongPrice();
		ERC721(_nftAddress).safeTransferFrom(
			address(this),
			msg.sender,
			_tokenId
		);
		bondToken.transferFrom(
			msg.sender,
			address(this),
			_amountBondToken * 10**18
		);
		bondToken.burn(_amountBondToken * 10**18);
	}

	function getPool(address nftAddress, uint256 tokenId)
		external
		view
		returns (Pool memory)
	{
		return pools[nftAddress][tokenId];
	}

	function onERC721Received(
		address,
		address,
		uint256,
		bytes memory
	) public virtual returns (bytes4) {
		return this.onERC721Received.selector;
	}
}
