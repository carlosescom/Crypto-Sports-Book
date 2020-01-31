const { makeInterfaceId } = require('../makeInterfaceId');

const SportsBook = artifacts.require('SportsBook');

require('chai')
  .should();

describe('makeInterfaceId', function () {
  it('calculates the EIP165 interface id from function signatures', async function () {
    const calculator = await SportsBook.new();
    const ownableId = await calculator.getInterfaceId();

    makeInterfaceId([
      'owner()',
      'isOwner()',
      'renounceOwnership()',
      'transferOwnership(address)',
    ]).should.equal(ownableId);
  });
});
