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
            fontSize: '0.5em',
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
        </tbody>
      </table>
    </div>

    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex={0} units="ether" precision={6} />
    </div>

    <div className="section">
      <h2>SportsBook Fields</h2>
      <p><strong>minFee: </strong>
        <ContractData contract="SportsBook" method="minFee" /> wei</p>
      <p><strong>minBet: </strong>
        <ContractData contract="SportsBook" method="minBet" /> wei</p>
      <p><strong>precision: </strong>
        <ContractData contract="SportsBook" method="precision" /> wei</p>
      <p><strong>profit: </strong>
        <ContractData contract="SportsBook" method="profit" /> wei</p>
      <p><strong>totalPool: </strong>
        <ContractData contract="SportsBook" method="totalPool" /> wei</p>
      <p><strong>SF bettors: </strong>
        <ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_bettors" /> bettors</p>
      <p><strong>KC bettors: </strong>
        <ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_bettors" /> bettors</p>
    </div>

    <div className="section">
      <h2>Submit your bets!</h2>
      <p>
        Here we have a form with custom, friendly labels. Also note the token
        symbol will not display a loading indicator. We've suppressed it with
        the <code>hideIndicator</code> prop because we know this variable is
        constant.
      </p>
      <ContractForm
        contract="SportsBook"
        method="bet"
        labels={["Team"]}
        sendArgs={{value:30000000000000000}}
      />
    </div>
  </div>
);
