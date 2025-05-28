const InfoContract = artifacts.require('InfoContract');
const PayableDemo = artifacts.require('PayableDemo');
const RedPacket = artifacts.require('RedPacket');

module.exports = function (deployer) {
  deployer.deploy(InfoContract);
  deployer.deploy(PayableDemo);
  deployer.deploy(RedPacket);
};
