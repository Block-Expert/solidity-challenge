//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract InterviewTestFixed is ERC20Burnable, Ownable {
    using Address for address;

    uint256 public totalBorrowed;
    uint256 public totalDeposit;
    uint256 public totalCollateral;
    uint256 public baseRate = 2 * 10**16;

    IERC20 public constant dai =
        IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    AggregatorV3Interface internal constant priceFeed =
        AggregatorV3Interface(0x773616E4d11A78F511299002da57A0a94577F1f4);

    mapping(address => uint256) private usersCollateral;
    mapping(address => uint256) private usersBorrowed;
    

    constructor() ERC20("Bond DAI", "bDAI") {}

    function bondAsset(uint256 _amount) public {
        totalDeposit += _amount;
        _mint(msg.sender, _amount);
        bool result = dai.transferFrom(msg.sender, address(this), _amount);
        require(result, "bondAsset failed");
    }

    function unbondAsset(uint256 _amount) public {
        totalDeposit -= _amount;
        burn(_amount);
        bool result = dai.transfer(msg.sender, _amount);
        require(result, "unbondAsset failed");
    }

    function addCollateral() public payable {
        require(msg.value > 0, "Cant send 0 ethers");
        usersCollateral[msg.sender] += msg.value;
        totalCollateral += msg.value;
    }

    function removeCollateral(uint256 _amount) public payable {
        require(usersCollateral[msg.sender] > 0, "Dont have any collateral");
        require(usersBorrowed[msg.sender] == 0, "Cant remove collateral due to borrowing");
        usersCollateral[msg.sender] -= _amount;
        totalCollateral -= _amount;

        (bool result, ) = msg.sender.call{value: _amount}("");
        require(result, "removeCollateral falied");
    }

    function borrow(uint256 _amount) public {
        require(
            _ETHtoDai(usersCollateral[msg.sender]) - _amount > 0,
            "No collateral enough"
        );
        usersBorrowed[msg.sender] += _amount;
        totalBorrowed += _amount;
        bool result = dai.transfer(msg.sender, _amount);
        require(result, "borrow failed");
    }

    function repay(uint256 _amount) public {
        require(usersBorrowed[msg.sender] > 0, "Dont have any debt to pay");
        uint256 paidAmount = (_amount * (10**18 - baseRate)) / 10**18;
        usersBorrowed[msg.sender] -= paidAmount;
        totalBorrowed -= paidAmount;
        bool result = dai.transferFrom(msg.sender, address(this), _amount);
        require(result, "repay failed");
    }

    function flashLoanDai(address borrower, uint256 borrowAmount) public {
        uint256 balanceBefore = dai.balanceOf(address(this));
        require(balanceBefore >= borrowAmount, "Not enough Dai in pool");

        uint256 fee = (borrowAmount * baseRate) / 10**18;
        // Transfer dai and handle control to receiver
        bytes memory data = borrower.functionCallWithValue(
            abi.encodeWithSignature("onReceive(uint256)", fee),
            borrowAmount
        );
        require(abi.decode(data, (uint256)) == fee, "flashLoanDai failed");
        require(
            dai.balanceOf(address(this)) >= balanceBefore + fee,
            "Flash loan hasn't been paid back"
        );
    }

    function flashLoanETH(address borrower, uint256 borrowAmount) public {
        uint256 balanceBefore = address(this).balance;
        require(balanceBefore >= borrowAmount, "Not enough ETH in pool");

        uint256 fee = (borrowAmount * baseRate) / 10**18;
        // Transfer ETH and handle control to receiver
        bytes memory data = borrower.functionCallWithValue(
            abi.encodeWithSignature("onReceive(uint256)", fee),
            borrowAmount
        );

        require(abi.decode(data, (uint256)) == fee, "flashLoanETH failed");
        require(
            address(this).balance >= balanceBefore + fee,
            "Flash loan hasn't been paid back"
        );
    }

    function _ETHtoDai(uint256 amount) public view returns (uint256) {
        uint256 price = uint256(_getLatestPrice());
        return amount / price;
    }

    function _DaiToETH(uint256 amount) public view returns (uint256) {
        uint256 price = uint256(_getLatestPrice());
        return amount * price;
    }

    function _getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function getCollateral() external view returns (uint256) {
        return usersCollateral[msg.sender];
    }

    function getBorrowed() external view returns (uint256) {
        return usersBorrowed[msg.sender];
    }

    receive() external payable {}

    fallback() external payable {}
}