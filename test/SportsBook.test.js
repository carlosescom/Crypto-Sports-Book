const shouldFail = require('./helpers/shouldFail');
const { ZERO_ADDRESS } = require('./helpers/constants');
const { ether } = require('./helpers/ether');
const { BN, should } = require('./helpers/setup');

const SportsBook = artifacts.require('SportsBook');

require('./helpers/setup');

contract('SportsBook', function ([
  whitelistAdmin,
  SF_Fan1, SF_Fan2, SF_Fan3, SF_Fan4,
  KC_Fan1, KC_Fan2, KC_Fan3, KC_Fan4, KC_Fan5
]) {
  const minFee = ether('10', 'finney');
  const minBet = minFee.mul(new BN('3',10));
  const amount1 = minFee.mul(new BN('5', 10));
  const amount2 = minFee.mul(new BN('7', 10));

  console.log(minFee);
  console.log(minBet);
  console.log(amount1);
  console.log(amount2);

  beforeEach(async function () {
    this.sportsBook = await SportsBook.new();
  });

  context('initially', function () {
    it('doesn\'t pre-initialize fields', async function () {
      (await this.sportsBook.profit()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.totalPool()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.SAN_FRANCISCO_49ERS_pool()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.SAN_FRANCISCO_49ERS_bettors()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.SAN_FRANCISCO_49ERS_score()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.KANSAS_CITY_CHIEFS_pool()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.KANSAS_CITY_CHIEFS_bettors()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.KANSAS_CITY_CHIEFS_score()).should.be.a.bignumber.that.is.zero;
    });

    describe('allows people to place bets', function () {
      it('reverts when trying to bet for NONE', async function () {
        await shouldFail(this.sportsBook.bet(0, { from: _, value: minBet }))
      });

      it('lets accounts bet for either team', async function () {
        await this.sportsBook.bet(1, { from: SF_Fan1, value: minBet });
        await this.sportsBook.bet(2, { from: KC_Fan1, value: minBet });
      });
    });
  });

  context('game starts', function () {
    beforeEach(async function () {
      await this.sportsBook.bet(1, { from: SF_Fan1, value: minBet });
      await this.sportsBook.bet(1, { from: SF_Fan2, value: amount1 });
      await this.sportsBook.bet(1, { from: SF_Fan3, value: amount1 });
      await this.sportsBook.bet(1, { from: SF_Fan4, value: amount2 });
      await this.sportsBook.bet(2, { from: KC_Fan1, value: minBet });
      await this.sportsBook.bet(2, { from: KC_Fan2, value: minBet });
      await this.sportsBook.bet(2, { from: KC_Fan3, value: minBet });
      await this.sportsBook.bet(2, { from: KC_Fan4, value: amount2 });
      await this.sportsBook.bet(2, { from: KC_Fan5, value: amount2 });
      await this.sportsBook.reportGameStarted({ from: whitelistAdmin });
    });

    describe('doesn\'t accept placing any more bets', function () {
      it('reverts when trying to place a bet for either team', async function () {
        await shouldFail.reverting(this.sportsBook.bet(1,{ from: SF_Fan1, value: minBet }));
        await shouldFail.reverting(this.sportsBook.bet(2,{ from: KC_Fan1, value: minBet }));
      });
    });

    context('game ends with Kansas City beating San Francisco 32-28', function () {
      beforeEach(async function () {
        await this.sportsBook.reportScoreForSanFrancisco(28, { from: whitelistAdmin });
        await this.sportsBook.reportScoreForKansasCity(32, { from: whitelistAdmin });
        await this.sportsBook.reportGameEnded({ from: whitelistAdmin });
      });

      describe('acknowledges the end of the game', function () {
        it('calling gameEnded() should return \'true\'', async function () {
          (await this.sportsBook.gameEnded()).should.be.true;
        });
      });

      describe('reflects correct score for both teams', function () {
        it('calling SAN_FRANCISCO_49ERS_score() should return 28', async function () {
          let SAN_FRANCISCO_49ERS_score = await this.sportsBook.SAN_FRANCISCO_49ERS_score();
          console.log(SAN_FRANCISCO_49ERS_score);
          SAN_FRANCISCO_49ERS_score.should.be.a.bignumber.that.equals(new BN('28', 10));
        });

        it('calling KANSAS_CITY_CHIEFS_score() should return 32', async function () {
          let KANSAS_CITY_CHIEFS_score = await this.sportsBook.KANSAS_CITY_CHIEFS_score();
          console.log(KANSAS_CITY_CHIEFS_score);
          KANSAS_CITY_CHIEFS_score.should.be.a.bignumber.that.equals(new BN('32', 10));
        });
      });

      describe('pays out to the correct addresses', function () {
        it('a winning bettor gets payed out', async function () {
          await this.sportsBook.claimPayout({ from: KC_Fan1 });
        });

        it('reverts when a losing bettor try to claim payouts', async function () {
          await shouldFail.reverting(this.sportsBook.claimPayout({ from: SF_Fan1 }));
        });

        it('reverts when non-bettors try to claim payouts', async function () {
          await shouldFail.reverting(this.sportsBook.claimPayout({ from: whitelistAdmin }));
        });
      });

      describe('all winners get payouts', function () {
        it('winners get payouts', async function () {
          await this.sportsBook.claimPayout({ from: KC_Fan2 });
          await this.sportsBook.claimPayout({ from: KC_Fan3 });
          await this.sportsBook.claimPayout({ from: KC_Fan4 });
          await this.sportsBook.claimPayout({ from: KC_Fan5 });
        });
      });
    });
  });
});
