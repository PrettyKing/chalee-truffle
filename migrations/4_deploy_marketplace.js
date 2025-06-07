// 方法1: 使用标签(Tags)进行选择性部署
const CHMToken = artifacts.require("CHMToken");
const CourseMarketplace = artifacts.require("CourseMarketplace");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    const tokenInstance = await CHMToken.deployed();
    await deployer.deploy(CourseMarketplace, tokenInstance.address);

    console.log("CourseMarketplace deployed at:", CourseMarketplace.address);
  });
};
