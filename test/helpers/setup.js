const chai = require('chai');
const BigNumber = require('bignumber.js');
const BN = require('BN.js');
const should = chai.use(require('chai-bn')(BN)).should();

module.exports = {
  BigNumber,
  should,
};
