const InfoContractAndPayable = artifacts.require('InfoContractAndPayable');

module.exports = function (deployer) {
  deployer.deploy(InfoContractAndPayable);
};
