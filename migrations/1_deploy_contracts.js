const InfoContract = artifacts.require('InfoContract');
const PayableDemo = artifacts.require('PayableDemo');

module.exports = function (deployer) {
  deployer.deploy(InfoContract);
  deployer.deploy(PayableDemo);
};
