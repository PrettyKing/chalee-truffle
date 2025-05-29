// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract InfoContractAndPayableAndRedPacket {
    // 测试数据 =====================
    string name;
    uint256 age;
    // 正式数据 =====================
    // 当前合约拥有人
    address public owner;
    //合约账户余额
    uint256 public balance;
    // 目前发了几个红包
    uint16 public currentPacketCountOfOwner = 0;
    // 红包id
    uint256 public packetId;
    // 记录所有红包的信息
    struct Packet {
        bool isEqual; // 是否是等额红包
        uint8 count; // 红包可领取次数
        uint8 remainingCount; // 红包剩余可领取次数
        uint256 amount; // 红包的金额
        uint256 remainingAmount; // 剩余红包金额
        mapping(address => bool) isGetForCurrentAccount; // 记住用户信息
    }
    mapping(uint256 => Packet) public packets; // 记录所有红包的信息

    event Deposit(address indexed sender, uint256 amount);
    event Withdraw(address indexed receiver, uint256 amount);
    event Instructor(string name, uint256 age);

    event PacketCreated(
        uint256 packetId,
        bool indexed isEqual,
        uint8 indexed count,
        uint256 indexed amount
    );

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

    // 发红包函数
    function sendRedPacket(
        bool isEqual,
        uint8 count,
        uint256 amount
    ) public payable {
        require(msg.value >= amount, "Your balance is insufficient");
        require(count > 0, "Count must be greater than zero");
        require(amount > 0, "Amount must be greater than zero");

        // 创建红包
        Packet storage newPacket = packets[packetId];
        newPacket.isEqual = isEqual;
        newPacket.count = count;
        newPacket.remainingCount = count;
        newPacket.amount = amount;
        newPacket.remainingAmount = amount;

        emit PacketCreated(packetId, isEqual, count, amount);

        packetId++;
        currentPacketCountOfOwner++;
    }
    // 领红包函数
    function getRedPacket(uint256 _packetId) public {
        Packet storage packet = packets[_packetId];
        require(packet.remainingCount > 0, "No remaining red packets");
        require(
            !packet.isGetForCurrentAccount[msg.sender],
            "You have already claimed this red packet"
        );

        // 领取红包
        packet.isGetForCurrentAccount[msg.sender] = true;
        packet.remainingCount--;
        packet.remainingAmount -= (packet.amount / packet.count);

        // 将红包金额转给用户
        payable(msg.sender).transfer(packet.amount / packet.count);
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
