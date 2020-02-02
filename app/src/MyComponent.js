import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

import logo from "./logo.png";

export default ({ accounts }) => (
  <div className="App">
    <div className="container">
      <img src={logo} alt="drizzle-logo" />
      <h1>Super Bowl LIV</h1>
      <table style={{
        fontSize: '3em',
        padding: '1em',
        width: '60%',
        margin: '0 auto'
      }}>
        <thead>
          <tr>
            <th>
              San Francisco
            </th>
              <th>
                Kansas City
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{
              backgroundColor: '#d12d2d',
              color: '#d9c69f',
              textShadow: '2px 2px 1px #000',
              width: '50%'
            }}>
              <ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_score" />
            </td>
            <td style={{
              backgroundColor: '#ea0000',
              color: '#fff',
              textShadow: '2px 2px 1px #ffc800',
              width: '50%'
            }}>
              <ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_score" />
            </td>
          </tr>
          <tr style={{
            fontSize: '0.4em',
          }}>
            <td>
              <strong>SF pool: </strong>
              <ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_pool" /> wei
          </td>
            <td>
              <strong>KC pool: </strong>
              <ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_pool" /> wei
            </td>
          </tr>
          <tr style={{
            fontSize: '0.4em',
          }}>
            <td>
              <strong>SF bettors: </strong>
              <ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_bettors" /> bettors
          </td>
            <td>
              <strong>KC bettors: </strong>
              <ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_bettors" /> bettors
          </td>
          </tr><tr style={{
            fontSize: '0.4em',
          }}>
            <td>
              <strong>profit for SF fans: </strong>
              <ContractData contract="SportsBook" method="profit_for_SAN_FRANCISCO_49ERS_bettors" /> wei
          </td>
            <td>
              <strong>profit for KC fans: </strong>
              <ContractData contract="SportsBook" method="profit_for_KANSAS_CITY_CHIEFS_bettors" /> wei
          </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="section">
      <h1>Game Info</h1>
      <p><strong>minFee: </strong>
        <ContractData contract="SportsBook" method="minFee" /> wei</p>
      <p><strong>minBet: </strong>
        <ContractData contract="SportsBook" method="minBet" /> wei</p>
      <p><strong>precision: </strong>
        <ContractData contract="SportsBook" method="precision" /> wei</p>
      <p><strong>totalPool: </strong>
        <ContractData contract="SportsBook" method="totalPool" /> wei</p>
      <p><strong>Has the game started?: </strong>
        <ContractData contract="SportsBook" method="gameStarted" /></p>
      <p><strong>Has the game ended?: </strong>
        <ContractData contract="SportsBook" method="gameEnded" /></p>
      <p><strong>Did your team win?: </strong>
        <ContractData contract="SportsBook" method="myTeamWon" /></p>
    </div>

    <div className="section">
      <h1>Submit your bets!</h1>
      <p>Enter <strong>1</strong> to bet for San Francisco</p>
      <p>Enter <strong>2</strong> to bet for Kansas City</p>
      <p>You will bet <strong>30 finney</strong> everytime you submit a bet.</p>
      <ContractForm
        contract="SportsBook"
        method="bet"
        labels={["Team"]}
        sendArgs={{value: 30000000000000000, gas: 3000000}}
      />
      <p>
        <strong>Was your bet acknowledged?: </strong>
        <ContractData contract="SportsBook" method="myBetWasPlaced" />
      </p>
      <p>
        <strong>How much have you bet?: </strong>
        <ContractData contract="SportsBook" method="howMuchHaveIBet" />
      </p>
      <span>
        You're betting from:
      </span>
      <AccountData accountIndex={0} units="ether" precision={6} />

    </div>

    <div className="section">
      <h1>Report the game!</h1>
      <p>
        <strong>
          You need to be a whitelisted admin to help the dapp know the score of the game. Users should be able to apply in a near future.
        </strong>
      </p>
      <p>
        Admins should be trustworthy people who will report the scores accurately. The correct functionality of this betting system depends on correct scores being reported.
      </p>
      <p>
        <strong>            
        Only report the score after NFL officials say the final word in a challenged play.
        </strong>
      </p>
      <br />
      <p><strong>Game Started</strong></p>
      <ContractForm
        contract="SportsBook"
        method="reportGameStarted"
        labels={[""]}
      />
      <br/>
      <p><strong>Score for San Francisco</strong></p>
      <ContractForm
        contract="SportsBook"
        method="setScoreForSanFrancisco"
        labels={["Score for SF"]}
        />
      <br/>
      <p><strong>Score for Kansas City</strong></p>
      <ContractForm
        contract="SportsBook"
        method="setScoreForKansasCity"
        labels={["Score for KC"]}
      />
      <br />
      <p><strong>Game Ended</strong></p>
      <ContractForm
        contract="SportsBook"
        method="reportGameEnded"
        labels={[""]}
      />
    </div>
  </div>
);
