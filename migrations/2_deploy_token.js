// 方法1: 使用标签(Tags)进行选择性部署
const CHMToken = artifacts.require("CHMToken");

module.exports = function (deployer, network, accounts) {
  // 只在特定网络部署
  if (network === "development" || network === "sepolia") {
    deployer.deploy(CHMToken, 1000000); // 100万代币
  }
};
