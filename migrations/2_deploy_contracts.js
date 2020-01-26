const ConditionalEscrow = artifacts.require("ConditionalEscrow");

module.exports = function(deployer) {
  deployer.deploy(ConditionalEscrow);
};
