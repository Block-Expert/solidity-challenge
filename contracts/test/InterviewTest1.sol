// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IERC20 {
    function totalSupply() external view returns(uint);
    function balanceOf(address who) external view returns (uint);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
}


contract BasicERC20 is IERC20 {

    mapping(address => uint) balances;

    mapping (address => mapping (address => uint)) allowed;

    string public name = "Test";
    string public symbol = "TST";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 10**(50+18);
    uint public override totalSupply;

    constructor(string memory _name, string memory _symbol, uint _decimals) {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    event Approval(address sender, address spender, uint amount);
    function approve(address _spender, uint _value) public override returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view override returns (uint remaining) {
        return allowed[_owner][_spender];
    }

    event Transfer(address sender, address receiver, uint amount);
    function transfer(address _to, uint _value)  public override returns (bool) {
        require(balances[msg.sender] - _value >= 0);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public override returns (bool) {
        uint _allowance = allowed[_from][msg.sender];

        if (_value > _allowance) revert();

        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
    }

    function balanceOf(address _owner) public view override returns (uint balance) {
        return balances[_owner];
    }

    event Burn(address indexed _burner, uint _value);

    function burn(uint _value) public returns (bool) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0x0), _value);
        return true;
    }

    // save some gas by making only one contract call
    function burnFrom(address _from, uint256 _value) public returns (bool) {
        transferFrom( _from, msg.sender, _value);
        return burn(_value);
    }
}

// Inherited by Lottery contract to allow users to make multiple guesses in a single tx
contract Multicall {
    function multicall(bytes[] calldata calls, bool revertOnFail) external payable returns (bool[] memory successes, bytes[] memory results) {
        successes = new bool[](calls.length);
        results = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory result) = address(this).delegatecall(calls[i]);
            require(success || !revertOnFail, _getRevertMsg(result));
            successes[i] = success;
            results[i] = result;
        }
    }
    
    function _getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
        // If the _res length is less than 68, then the transaction failed silently (without a revert message)
        if (_returnData.length < 68) return "Transaction reverted silently";

        assembly {
            // Slice the sighash.
            _returnData := add(_returnData, 0x04)
        }
        return abi.decode(_returnData, (string)); // All that remains is the revert string
    }
}

interface IWeth is IERC20 {
    function deposit() external payable;
    function withdraw(uint) external;
}

/// Lottery contract that requires users to guess the block hash of a specified block number
/// A user can make multiple guesses, with each guess costing 0.1 eth
/// A user can also withdraw their guess and be refunded
contract Lottery is Multicall {
    IWeth weth;
    // each guess costs 0.1 eth
    uint256 constant GUESS_COST = 1e17;
    // list of particpiants for this game
    address[] public guessers;
    // end block number for guessing period
    uint32 public endBlockNum;
    // guesses each participiant made
    mapping(address => bytes32[]) public guesses;
    // total deposited funds per guesser
    mapping(address => uint256) public stakes;

    constructor(IWeth _weth, uint32 _endBlockNum) {
        weth = _weth;
        endBlockNum = _endBlockNum;
    }
    
    modifier beforeEnd() {
        require(uint32(block.number) < endBlockNum, 'guessing period ended');
        _;
    }

    // a guesser made a guess with ETH
    function guessWithEth(bytes32 hash) public payable beforeEnd {
        require(msg.value >= GUESS_COST, 'lack of funds');
        weth.deposit{value: msg.value}();
        _guess(hash);
    }
    
    // a guesser made a guess with WETH
    function guessWithWeth(bytes32 hash, uint256 amount) public payable beforeEnd {
        weth.transferFrom(msg.sender, address(this), amount);
        _guess(hash);
    }
    

    event WithdrawGuess(address guesser, uint256 index);
    // withdraw guess, unwrap and withdraw eth
    // index = guess index in array
    function withdrawGuess(uint256 index) public payable beforeEnd {
        require(stakes[msg.sender] - GUESS_COST >= 0);
        // remove guess
        delete guesses[msg.sender][index];
        weth.withdraw(GUESS_COST);
        payable(msg.sender).transfer(GUESS_COST);
        stakes[msg.sender] -= GUESS_COST;
        // if no more guesses, remove from list
        for(uint256 i = guessers.length - 1; i >= 0; i--) {
            if (guessers[i] == msg.sender) {
                guessers[i] = guessers[guessers.length - 1];
                guessers.pop();
            }
        }
        emit WithdrawGuess(msg.sender, index);
    }
    
    // after voting period, anyone will be able to withdraw entire contract balance
    // but only if they are lucky enough in guessing the end block hash
    function winContractFunds(uint256 index) external {
        require(uint32(block.number) >= endBlockNum, 'guessing period has not ended');
        require(guesses[msg.sender][index] == keccak256(abi.encodePacked(blockhash(endBlockNum))));
        weth.withdraw(weth.balanceOf(address(this)));
        payable(msg.sender).transfer(address(this).balance);
    }

    function getGuesses(address guesser) public view returns(bytes32[] memory) {
        return guesses[guesser];
    }
    
    event Guessed(address guesser, bytes32 guess);
    function _guess(bytes32 hash) internal {
        // new guesser, add to list
        if (guesses[msg.sender].length == 0) {
            guessers.push(msg.sender);
        }
        stakes[msg.sender] += GUESS_COST;
        guesses[msg.sender].push(hash);
        emit Guessed(msg.sender, hash);
    } 
}