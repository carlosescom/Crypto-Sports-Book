function ether(n,denomination) {
  return web3.utils.toBN(web3.utils.toWei(n.toString(10), denomination));
}

module.exports = {
  ether,
};
