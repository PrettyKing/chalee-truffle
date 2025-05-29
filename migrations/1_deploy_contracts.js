const InfoContractAndPayableAndRedPacket = artifacts.require(
  "InfoContractAndPayableAndRedPacket"
);

module.exports = function (deployer) {
  deployer.deploy(InfoContractAndPayableAndRedPacket);
};
