const shouldFail = require('./helpers/shouldFail');
const { ZERO_ADDRESS } = require('./helpers/constants');
const { ether } = require('./helpers/ether');

const SportsBook = artifacts.require('SportsBook');

require('./helpers/setup');

contract('SportsBook', function ([
  whitelistAdmin,
  SF_Fan1, SF_Fan2, SF_Fan3, SF_Fan4,
  KC_Fan1, KC_Fan2, KC_Fan3, KC_Fan4, KC_Fan5
]) {
  const minFee = ether('10', 'finney');
  const minBet = ether((3 * minFee).toString(10), 'finney');
  const amount1 = ether('5794', 'shannon');
  const amount2 = ether('3249534', 'lovelace');

  beforeEach(async function () {
    this.sportsBook = await SportsBook.new();
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
        await this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet })
      });

      it('reverts when trying to bet for NONE', async function () {
        await this.sportsBook.bet(0).send({ from: _, value: minBet })
      });
    });
  });

  context('game started', function () {
    beforeEach(async function () {
      this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet });
      this.sportsBook.bet(1).send({ from: SF_Fan2, value: amount1 });
      this.sportsBook.bet(1).send({ from: SF_Fan3, value: amount1 });
      this.sportsBook.bet(1).send({ from: SF_Fan4, value: amount2 });
      this.sportsBook.bet(2).send({ from: KC_Fan1, value: minBet });
      this.sportsBook.bet(2).send({ from: KC_Fan2, value: minBet });
      this.sportsBook.bet(2).send({ from: KC_Fan3, value: minBet });
      this.sportsBook.bet(2).send({ from: KC_Fan4, value: amount2 });
      await this.sportsBook.reportgameStarted(28).send({ from: whitelistAdmin });
    });

    describe('doesn\'t accept placing any more bets', function () {
      it('reverts when trying to place a bet for either team', async function () {
        await shouldFail.reverting(this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet }));
        await shouldFail.reverting(this.sportsBook.bet(2).send({ from: KC_Fan1, value: minBet }));
      });
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
      await this.sportsBook.reportgameStarted(28).send({ from: whitelistAdmin });
      await this.sportsBook.reportScoreForSanFrancisco(28).send({ from: whitelistAdmin });
      await this.sportsBook.reportScoreForKansasCity(32).send({ from: whitelistAdmin });
      await this.sportsBook.reportgameEnded().send({ from: whitelistAdmin });
    });

    describe('doesn\'t accept placing any more bets', function () {
      it('reverts when trying to place a bet', async function () {
        await shouldFail.reverting(this.sportsBook.bet(1).send({ from: SF_Fan1, value: minBet }));
      });
    });

    describe('pays out to the correct addresses', function () {
      it('winners get payouts', async function () {
        this.sportsBook.claimPayout().send({ from: KC_Fan1, value: minBet });
      });

      it('reverts when losing bettors try to claim payouts', async function () {
        await shouldFail.reverting(this.sportsBook.claimPayout().send({ from: SF_Fan1 }));
      });

      it('reverts when non-bettors try to claim payouts', async function () {
        await shouldFail.reverting(this.sportsBook.claimPayout().send({ from: whitelistAdmin }));
      });
    });

    describe('all winners get payouts', function () {
      it('winners get payouts', async function () {
        this.sportsBook.claimPayout().send({ from: KC_Fan1 });
        this.sportsBook.claimPayout().send({ from: KC_Fan2 });
        this.sportsBook.claimPayout().send({ from: KC_Fan3 });
        this.sportsBook.claimPayout().send({ from: KC_Fan4 });
        this.sportsBook.claimPayout().send({ from: KC_Fan5 });
      });

      it('reverts when losing bettors try to claim payouts', async function () {
        await shouldFail.reverting(this.sportsBook.claimPayout().send({ from: SF_Fan1 }));
      });

      it('reverts when non-bettors try to claim payouts', async function () {
        await shouldFail.reverting(this.sportsBook.claimPayout().send({ from: whitelistAdmin }));
      });
    });
  });
});
