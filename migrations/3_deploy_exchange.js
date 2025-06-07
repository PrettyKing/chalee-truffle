// 方法1: 使用标签(Tags)进行选择性部署
const CHMToken = artifacts.require("CHMToken");
const CHMExchange = artifacts.require("CHMExchange");

module.exports = function (deployer, network, accounts) {
  // 使用标签控制部署
  deployer.then(async () => {
    // 获取已部署的代币合约
    const tokenInstance = await CHMToken.deployed();
    
    // 部署交易所合约
    await deployer.deploy(CHMExchange, tokenInstance.address);
    
    console.log("CHMExchange deployed at:", CHMExchange.address);
  });
};
