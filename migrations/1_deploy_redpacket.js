const RedPacketContract = artifacts.require("RedPacketContract");

module.exports = function (deployer) {
  deployer.deploy(RedPacketContract);
};
