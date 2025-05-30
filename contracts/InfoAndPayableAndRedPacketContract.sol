// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InfoAndPayableAndRedPacketContract {
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

    event PacketClaimed(
        uint256 indexed packetId,
        address indexed claimer,
        uint256 amount
    );

    // 修复构造函数 - 移除错误的payable转换
    constructor() {
        owner = msg.sender;
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

    // 提款函数 - 改用call提高安全性
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient balance");
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }

    // 将合约拥有的钱转给合约拥有者
    function transferToOwner() public {
        require(msg.sender == owner, "Only the owner can transfer funds");
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No balance to transfer");
        
        (bool success, ) = payable(owner).call{value: contractBalance}("");
        require(success, "Transfer failed");
    }

    // 发红包函数 - 修复所有问题
    function sendRedPacket(
        bool isEqual,
        uint8 count,
        uint256 amount
    ) public payable {
        require(msg.value > 0, "Must send some ether");
        require(msg.value >= amount, "Your balance is insufficient");
        require(count > 0 && count <= 100, "Count must be between 1 and 100");
        require(amount > 0, "Amount must be greater than zero");
        require(msg.value == amount, "Sent value must equal amount");
        
        // 增加红包数量限制到10个
        require(
            currentPacketCountOfOwner < 10,
            "You can send at most 10 red packets"
        );
        
        Packet storage packet = packets[packetId];
        packet.isEqual = isEqual;
        packet.count = count;
        packet.remainingCount = count;
        packet.amount = amount;
        packet.remainingAmount = amount;
        
        emit PacketCreated(packetId, isEqual, count, amount);
        
        currentPacketCountOfOwner++;
        packetId++;
    }
    
    // 领红包函数 - 增加随机红包支持
    function getRedPacket(uint256 _packetId) public {
        require(_packetId < packetId, "Invalid packet ID");
        
        Packet storage packet = packets[_packetId];
        require(packet.remainingCount > 0, "No remaining red packets");
        require(
            !packet.isGetForCurrentAccount[msg.sender],
            "You have already claimed this red packet"
        );

        // 领取红包
        packet.isGetForCurrentAccount[msg.sender] = true;
        packet.remainingCount--;
        
        uint256 claimAmount;
        if (packet.isEqual) {
            // 等额红包
            claimAmount = packet.amount / packet.count;
        } else {
            // 随机红包算法
            if (packet.remainingCount == 0) {
                // 最后一个红包，给剩余所有金额
                claimAmount = packet.remainingAmount;
            } else {
                // 计算随机金额，确保公平分配
                uint256 avgAmount = packet.remainingAmount / (packet.remainingCount + 1);
                uint256 maxAmount = avgAmount * 2;
                if (maxAmount > packet.remainingAmount) {
                    maxAmount = packet.remainingAmount;
                }
                // 使用改进的随机算法
                uint256 randomSeed = uint256(keccak256(abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    _packetId,
                    packet.remainingCount
                )));
                claimAmount = (randomSeed % maxAmount) + 1;
                
                // 确保不超过剩余金额
                if (claimAmount > packet.remainingAmount) {
                    claimAmount = packet.remainingAmount;
                }
            }
        }
        
        packet.remainingAmount -= claimAmount;

        // 将红包金额转给用户
        (bool success, ) = payable(msg.sender).call{value: claimAmount}("");
        require(success, "Transfer failed");
        
        emit PacketClaimed(_packetId, msg.sender, claimAmount);
    }

    // 重置红包计数器 - 用于测试
    function resetPacketCount() public {
        require(msg.sender == owner, "Only owner can reset");
        currentPacketCountOfOwner = 0;
    }

    // 获取红包详细信息
    function getPacketInfo(uint256 _packetId) public view returns (
        bool isEqual,
        uint8 count,
        uint8 remainingCount,
        uint256 amount,
        uint256 remainingAmount,
        bool hasClaimed
    ) {
        require(_packetId < packetId, "Invalid packet ID");
        Packet storage packet = packets[_packetId];
        return (
            packet.isEqual,
            packet.count,
            packet.remainingCount,
            packet.amount,
            packet.remainingAmount,
            packet.isGetForCurrentAccount[msg.sender]
        );
    }

    // 检查用户是否已领取红包
    function hasClaimedPacket(uint256 _packetId, address user) public view returns (bool) {
        require(_packetId < packetId, "Invalid packet ID");
        return packets[_packetId].isGetForCurrentAccount[user];
    }

    // ============================================
    // 测试数据
    function sayHi() public pure returns (string memory) {
        return "Hello World! Red Packet Contract is ready!";
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
    
    // 接收以太币
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}