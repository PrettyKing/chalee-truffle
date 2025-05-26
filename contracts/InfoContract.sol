// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract InfoContractAndPayable {
    string name;
    uint256 age;

    //账户余额
    uint256 public balance;
    // 当前合约拥有人
    address public owner;

    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed receiver, uint256 amount);
    event Instructor(string name, uint256 age);

    // 合约的主人是谁
    constructor() {
        // 这个是owner就是谁
        owner = payable(msg.sender);
    }

    // 获取合约余额
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 存款函数
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit Deposit(msg.sender, msg.value);
    }

    // 提款函数
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    // 将合约拥有的钱转给合约拥有者
    function transferToOwner() public {
        require(msg.sender == owner, "Only the owner can transfer funds");
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No balance to transfer");
        payable(owner).transfer(contractBalance);
    }

    // ============================================
    // 测试数据
    function sayHi() public pure returns (string memory) {
        return "Hello World!";
    }

    function setInfo(string memory _name, uint256 _age) public {
        name = _name;
        age = _age;
        //触发一下前端监听
        emit Instructor(_name, _age);
    }

    function getInfo() public view returns (string memory, uint256) {
        return (name, age);
    }
}
