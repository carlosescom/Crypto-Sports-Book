const shouldFail = require('./helpers/shouldFail');
const { ZERO_ADDRESS } = require('./helpers/constants');
const { ether } = require('./helpers/ether');
const { BN, should } = require('./helpers/setup');
const { balanceDifference } = require('./helpers/balanceDifference');
const expectEvent = require('./helpers/expectEvent');

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
      (await this.sportsBook.totalPool()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.SAN_FRANCISCO_49ERS_pool()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.SAN_FRANCISCO_49ERS_bettors()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.SAN_FRANCISCO_49ERS_score()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.profit_for_SAN_FRANCISCO_49ERS_bettors()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.KANSAS_CITY_CHIEFS_pool()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.KANSAS_CITY_CHIEFS_bettors()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.KANSAS_CITY_CHIEFS_score()).should.be.a.bignumber.that.is.zero;
      (await this.sportsBook.profit_for_KANSAS_CITY_CHIEFS_bettors()).should.be.a.bignumber.that.is.zero;
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

  context('bettors make their bets', function () {
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
    });

    describe('acknowledges bettors\' team choice', function () {
      it('calling myTeam(SF_Fan1) should return \'1\'', async function () {
        (await this.sportsBook.myTeam(SF_Fan1)).should.be.a.bignumber.that.equals(new BN('1', 10));
      });

      it('calling myTeam(KC_Fan1) should return \'2\'', async function () {
        (await this.sportsBook.myTeam(KC_Fan1)).should.be.a.bignumber.that.equals(new BN('2', 10));
      });
    });

    describe('acknowledges bets', function () {
      it('calling myBetWasPlaced({from:SF_Fan1}) should return \'true\'', async function () {
        (await this.sportsBook.myBetWasPlaced({ from: SF_Fan1 })).should.be.true;
      });

      it('calling myBetWasPlaced({from:KC_Fan1}) should return \'true\'', async function () {
        (await this.sportsBook.myBetWasPlaced({ from: KC_Fan1 })).should.be.true;
      });
    });

    describe('correctly records the amount of each bet', function () {
      it('calling depositsOf(SF_Fan1) should return \'20 finney\'', async function () {
        let bet = await this.sportsBook.depositsOf(SF_Fan1);
        bet.should.be.a.bignumber.that.equals(ether('20', 'finney'));
      });

      it('calling depositsOf(KC_Fan1) should return \'20 finney\'', async function () {
        let bet = await this.sportsBook.depositsOf(KC_Fan1);
        bet.should.be.a.bignumber.that.equals(ether('20', 'finney'));
      });
    });

    context('game starts', function () {
      beforeEach(async function () {
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
            SAN_FRANCISCO_49ERS_score.should.be.a.bignumber.that.equals(new BN('28', 10));
          });

          it('calling KANSAS_CITY_CHIEFS_score() should return 32', async function () {
            let KANSAS_CITY_CHIEFS_score = await this.sportsBook.KANSAS_CITY_CHIEFS_score();
            KANSAS_CITY_CHIEFS_score.should.be.a.bignumber.that.equals(new BN('32', 10));
          });
        });

        describe('acknowledges bettors\' wins and losses', function () {
          it('calling myTeamWon({from:SF_Fan1}) should return \'false\'', async function () {
            (await this.sportsBook.myTeamWon({ from: SF_Fan1 })).should.be.false;
          });

          it('calling myTeamWon({from:KC_Fan1}) should return \'true\'', async function () {
            (await this.sportsBook.myTeamWon({ from: KC_Fan1 })).should.be.true;
          });
        });

        context('pays out to the correct addresses', function () {
          describe('Kansas City fan tries to claim his payout', function () {
            let txReceipt
            beforeEach(async function () {
              txReceipt = await this.sportsBook.claimPayout({ from: KC_Fan1 })
            });

            it('calling claimPayout({from:KC_Fan2}) should emit an event called Withdrawn', async function () {
              expectEvent.inLogs(txReceipt.logs, 'Withdrawn', {
                payee: KC_Fan1,
                // weiAmount: minBet,
              });
            });
          });

          it('reverts when a losing bettor tries to claim a payout', async function () {
            await shouldFail.reverting(this.sportsBook.claimPayout({ from: SF_Fan1 }));
          });

          it('reverts when a non-bettor tries to claim a payout', async function () {
            await shouldFail.reverting(this.sportsBook.claimPayout({ from: whitelistAdmin }));
          });
        });

        describe('payouts are fairly distributed', function () {
          it('all winners get payouts', async function () {
            await this.sportsBook.claimPayout({ from: KC_Fan2 });
            await this.sportsBook.claimPayout({ from: KC_Fan3 });
            await this.sportsBook.claimPayout({ from: KC_Fan4 });
            await this.sportsBook.claimPayout({ from: KC_Fan5 });
          });
        });
      });
    });
  });
});
