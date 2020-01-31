const SportsBook = artifacts.require("SportsBook");

module.exports = function(deployer) {
  deployer.deploy(SportsBook);
};
