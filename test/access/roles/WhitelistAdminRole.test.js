const { shouldBehaveLikePublicRole } = require('./PublicRole.behavior');
const SportsBook = artifacts.require('SportsBook');

contract('WhitelistAdminRole', function ([_, whitelistAdmin, otherWhitelistAdmin, ...otherAccounts]) {
  beforeEach(async function () {
    this.contract = await SportsBook.new({ from: whitelistAdmin });
    await this.contract.addWhitelistAdmin(otherWhitelistAdmin, { from: whitelistAdmin });
  });

  shouldBehaveLikePublicRole(whitelistAdmin, otherWhitelistAdmin, otherAccounts, 'whitelistAdmin');
});
