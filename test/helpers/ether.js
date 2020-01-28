const BigNumber = require('bignumber.js');

function ether(n) {
  return new BigNumber(web3.utils.toWei(n.toString(10), 'ether'));
}

module.exports = {
  ether,
};
