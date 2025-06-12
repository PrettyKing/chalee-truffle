// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LogChain {
    // 存储数据的数组
    string[] public data;
    
    // 事件
    event Log(string data);
    event DataReceived(string data, address sender, uint256 value);
    
    // receive函数：接收ETH时触发（纯ETH转账，无数据）
    receive() external payable {
        // receive函数中msg.data总是空的，所以存储默认消息
        string memory defaultMsg = "ETH received";
        data.push(defaultMsg);
        emit DataReceived(defaultMsg, msg.sender, msg.value);
    }
    
    // fallback函数：处理带数据的调用
    fallback() external payable {
        if (msg.data.length > 0) {
            string memory receivedData = string(msg.data);
            data.push(receivedData);
            emit DataReceived(receivedData, msg.sender, msg.value);
        }
    }
    
    // 直接调用存储数据
    function storeData(string memory _data) public payable {
        data.push(_data);
        emit Log(_data);
        emit DataReceived(_data, msg.sender, msg.value);
    }
    
    // 获取所有数据
    function getAllData() public view returns (string[] memory) {
        return data;
    }
    
    // 获取数据数量
    function getDataCount() public view returns (uint256) {
        return data.length;
    }
    
    // 获取指定索引的数据
    function getData(uint256 index) public view returns (string memory) {
        require(index < data.length, "Index out of bounds");
        return data[index];
    }
}