const chai = require('chai');
const BigNumber = require('bignumber.js');
const should = chai.use(require('chai-bignumber')(BigNumber)).should();

module.exports = {
  BigNumber,
  should,
};
