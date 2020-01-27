const shouldFail = require('./helpers/shouldFail');
const { ZERO_ADDRESS } = require('./helpers/constants');
const { ether } = require('./ether');

const ConditionalEscrow = artifacts.require('ConditionalEscrow');

require('./../helpers/setup');

contract('Roles', function ([
  whitelistAdmin,
  SF_Fan1, SF_Fan2, SF_Fan3, SF_Fan4,
  KC_Fan1, KC_Fan2, KC_Fan3, KC_Fan4, KC_Fan5
]) {
  const minFee = ether(10, 'finney');
  const minBet = ether(3 * minFee, 'finney');
  const amount1 = ether(5794, 'shannon');
  const amount2 = ether(3249534, 'lovelace');

  beforeEach(async function () {
    this.sportsBook = await ConditionalEscrow.new();
  });

  it('reverts when querying roles for the null account', async function () {
    await shouldFail.reverting(this.roles.has(ZERO_ADDRESS));
  });

  context('initially', function () {
    it('doesn\'t pre-initialize fields', async function () {
      (await this.sportsBook.profit()).should.equal(0);
      (await this.sportsBook.totalPool()).should.equal(0);
      (await this.sportsBook.SAN_FRANCISCO_49ERS_pool()).should.equal(0);
      (await this.sportsBook.SAN_FRANCISCO_49ERS_bettors()).should.equal(0);
      (await this.sportsBook.SAN_FRANCISCO_49ERS_score()).should.equal(0);
      (await this.sportsBook.KANSAS_CITY_CHIEFS_pool()).should.equal(0);
      (await this.sportsBook.KANSAS_CITY_CHIEFS_bettors()).should.equal(0);
      (await this.sportsBook.KANSAS_CITY_CHIEFS_score()).should.equal(0);
    });

    describe('allows people to place bets', function () {
      it('lets accounts bet for either team', async function () {
        await this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet })
      });

      it('reverts when trying to bet for NONE', async function () {
        await this.sportsBook.bet(0).send({ from: _, value: minBet })
      });
    });
  });

  context('game started', function () {
    beforeEach(async function () {

    });
  });

  context('game ended', function () {
    beforeEach(async function () {
      this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet });
      this.sportsBook.bet(1).send({ from: SF_Fan2, value: amount1 });
      this.sportsBook.bet(1).send({ from: SF_Fan3, value: amount1 });
      this.sportsBook.bet(1).send({ from: SF_Fan4, value: amount2 });
      this.sportsBook.bet(2).send({ from: KC_Fan1, value: minBet });
      this.sportsBook.bet(2).send({ from: KC_Fan2, value: minBet });
      this.sportsBook.bet(2).send({ from: KC_Fan3, value: minBet });
      this.sportsBook.bet(2).send({ from: KC_Fan4, value: amount2 });
      this.sportsBook.bet(2).send({ from: KC_Fan5, value: amount2 });
      await this.sportsBook.reportScoreForSanFrancisco(28).send({ from: whitelistAdmin });
      await this.sportsBook.reportScoreForKansasCity(32).send({ from: whitelistAdmin });
      await this.sportsBook.setWinningTeam().send({ from: whitelistAdmin });
    });

    describe('removing roles', function () {
      it('reverts when trying to place a bet', async function () {
        await shouldFail.reverting(this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet }));
      });

      it('reverts when losing bettors try to claim payouts', async function () {
        this.sportsBook.claimPayout().send({ from: SF_Fan1, value: minBet });
      });
    });
  });
});
