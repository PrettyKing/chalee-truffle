// ===================================
// 方法2: 使用环境变量控制部署
// ===================================

const CHMToken = artifacts.require("CHMToken");
const CHMExchange = artifacts.require("CHMExchange");
const CourseMarketplace = artifacts.require("CourseMarketplace");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    let tokenInstance;
    
    // 1. 检查是否需要部署代币合约
    if (process.env.DEPLOY_TOKEN === 'true') {
      console.log("部署CHM代币合约...");
      await deployer.deploy(CHMToken, 1000000);
      tokenInstance = await CHMToken.deployed();
      console.log("CHM Token deployed at:", tokenInstance.address);
    } else {
      // 使用已存在的代币合约地址
      const existingTokenAddress = process.env.CHM_TOKEN_ADDRESS;
      if (existingTokenAddress) {
        tokenInstance = await CHMToken.at(existingTokenAddress);
        console.log("Using existing CHM Token at:", existingTokenAddress);
      }
    }
    
    // 2. 检查是否需要部署交易所合约
    if (process.env.DEPLOY_EXCHANGE === 'true' && tokenInstance) {
      console.log("部署CHM交易所合约...");
      await deployer.deploy(CHMExchange, tokenInstance.address);
      console.log("CHM Exchange deployed at:", CHMExchange.address);
    }
    
    // 3. 检查是否需要部署课程市场合约
    if (process.env.DEPLOY_MARKETPLACE === 'true' && tokenInstance) {
      console.log("部署课程市场合约...");
      await deployer.deploy(CourseMarketplace, tokenInstance.address);
      console.log("Course Marketplace deployed at:", CourseMarketplace.address);
    }
  });
};