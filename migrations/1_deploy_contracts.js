const InfoContractAndPayable = artifacts.require('InfoContractAndPayable');
const RedPacket = artifacts.require('RedPacket');

module.exports = function (deployer) {
  deployer.deploy(InfoContractAndPayable);
  deployer.deploy(RedPacket);
};
