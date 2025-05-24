// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PayableDemo {
    // 事件
    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed receiver, uint256 amount);

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

    // 获取合约余额
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
