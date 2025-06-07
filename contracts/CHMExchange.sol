// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CHMToken.sol";
// ================================
// 2. ETH/CHM交易所合约
// ================================
contract CHMExchange {
    CHMToken public chmToken;
    address public owner;
    uint256 public exchangeRate = 1000; // 1 ETH = 1000 CHM
    
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event TokensSold(address indexed seller, uint256 tokenAmount, uint256 ethAmount);
    event RateUpdated(uint256 newRate);
    event LiquidityAdded(uint256 ethAmount, uint256 tokenAmount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    constructor(address _chmTokenAddress) {
        chmToken = CHMToken(_chmTokenAddress);
        owner = msg.sender;
    }
    
    // 用ETH购买CHM代币
    function buyTokens() external payable {
        require(msg.value > 0, "Must send ETH");
        
        uint256 tokenAmount = msg.value * exchangeRate;
        require(chmToken.balanceOf(address(this)) >= tokenAmount, "Insufficient tokens in exchange");
        
        chmToken.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }
    
    // 用CHM代币兑换ETH
    function sellTokens(uint256 _tokenAmount) external {
        require(_tokenAmount > 0, "Must sell positive amount");
        require(chmToken.balanceOf(msg.sender) >= _tokenAmount, "Insufficient token balance");
        
        uint256 ethAmount = _tokenAmount / exchangeRate;
        require(address(this).balance >= ethAmount, "Insufficient ETH in exchange");
        
        chmToken.transferFrom(msg.sender, address(this), _tokenAmount);
        payable(msg.sender).transfer(ethAmount);
        emit TokensSold(msg.sender, _tokenAmount, ethAmount);
    }
    
    // 获取购买代币所需的ETH数量
    function getETHAmountForTokens(uint256 _tokenAmount) external view returns (uint256) {
        return _tokenAmount / exchangeRate;
    }
    
    // 获取ETH可以购买的代币数量
    function getTokenAmountForETH(uint256 _ethAmount) external view returns (uint256) {
        return _ethAmount * exchangeRate;
    }
    
    // 更新汇率（仅所有者）
    function updateExchangeRate(uint256 _newRate) external onlyOwner {
        require(_newRate > 0, "Rate must be positive");
        exchangeRate = _newRate;
        emit RateUpdated(_newRate);
    }
    
    // 添加流动性（仅所有者）
    function addLiquidity(uint256 _tokenAmount) external payable onlyOwner {
        require(msg.value > 0, "Must send ETH");
        require(_tokenAmount > 0, "Must provide tokens");
        
        chmToken.transferFrom(msg.sender, address(this), _tokenAmount);
        emit LiquidityAdded(msg.value, _tokenAmount);
    }
    
    // 提取ETH（仅所有者）
    function withdrawETH(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient ETH balance");
        payable(owner).transfer(_amount);
    }
    
    // 提取代币（仅所有者）
    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(chmToken.balanceOf(address(this)) >= _amount, "Insufficient token balance");
        chmToken.transfer(owner, _amount);
    }
    
    // 查看合约ETH余额
    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // 查看合约代币余额
    function getTokenBalance() external view returns (uint256) {
        return chmToken.balanceOf(address(this));
    }
    
    // 紧急暂停交易
    bool public tradingPaused = false;
    
    modifier whenTradingActive() {
        require(!tradingPaused, "Trading is paused");
        _;
    }
    
    function pauseTrading() external onlyOwner {
        tradingPaused = true;
    }
    
    function resumeTrading() external onlyOwner {
        tradingPaused = false;
    }
}