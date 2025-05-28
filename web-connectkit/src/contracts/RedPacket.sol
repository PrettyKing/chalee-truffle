// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract RedPacket {
    //定义红包发放的主题
    address payable public yideng;
    //红包的金额
    uint256 public totalAmount;
    //红包的个数
    uint256 public count;
    //等额红包
    bool public isEqual;
    //红包是否已初始化
    bool public isInitialized;
    //谁抢过红包
    mapping(address => bool) public isGrabbed;
    
    event RedPacketCreated(address indexed creator, uint256 amount, uint256 count, bool isEqual);
    event RedPacketGrabbed(address indexed grabber, uint256 amount);

    constructor() {
        // 空构造函数，使用独立函数初始化
    }

    // 独立的初始化函数，替代构造函数的存取方式
    function createRedPacket(uint256 c, bool _isEqual) public payable {
        require(!isInitialized, "RedPacket already initialized");
        require(msg.value > 0, "amount must > 0");
        require(c > 0, "count must > 0");
        
        yideng = payable(msg.sender);
        count = c;
        isEqual = _isEqual;
        totalAmount = msg.value;
        isInitialized = true;
        
        emit RedPacketCreated(msg.sender, msg.value, c, _isEqual);
    }

    //获取账户余额
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function grabRedPacket() public {
        require(isInitialized, "RedPacket not initialized");
        //判断 是否count已经发完
        require(count > 0, "count must > 0");
        //判断一下钱是不是发完了
        require(totalAmount > 0, "totalAmount must > 0");
        //现在调用合约这个人 是不是已经抢过红包了
        require(!isGrabbed[msg.sender], "you have grabed");
        
        isGrabbed[msg.sender] = true;
        uint256 amount;
        
        if (count == 1) {
            //把账户的余额都转给1个人
            amount = totalAmount;
            totalAmount = 0;
            payable(msg.sender).transfer(amount);
        } else {
            if (isEqual) {
                amount = totalAmount / count;
                totalAmount -= amount;
                payable(msg.sender).transfer(amount);
            } else {
                //算一个随机数 把总额进行拆分
                //如果不是等额红包 计算一个10以内的随机数
                uint256 random = (uint256(
                    keccak256(
                        abi.encodePacked(
                            msg.sender,
                            yideng,
                            count,
                            totalAmount,
                            block.timestamp
                        )
                    )
                ) % 8) + 1;
                amount = (totalAmount * random) / 10;
                payable(msg.sender).transfer(amount);
                totalAmount -= amount;
            }
        }
        count--;
        
        emit RedPacketGrabbed(msg.sender, amount);
    }
    
    // 获取红包信息
    function getRedPacketInfo() public view returns (
        address creator,
        uint256 remaining,
        uint256 remainingCount,
        bool equalDistribution,
        bool initialized
    ) {
        return (yideng, totalAmount, count, isEqual, isInitialized);
    }
    
    // 检查用户是否已抢过红包
    function hasGrabbed(address user) public view returns (bool) {
        return isGrabbed[user];
    }
}