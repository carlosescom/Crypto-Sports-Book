const { ethGetBalance } = require('./web3');
const BN = require('BN.js');

async function balanceDifference (account, promiseFunc) {
  const balanceBefore = await ethGetBalance(account);
  await promiseFunc();
  const balanceAfter = await ethGetBalance(account);
  return new BN(balanceAfter,10).sub(new BN(balanceBefore,10));
}

module.exports = {
  balanceDifference,
};
