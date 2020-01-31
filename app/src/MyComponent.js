import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

import logo from "./logo.png";

export default ({ accounts }) => (
  <div className="App">
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Crypto Sports Book</h1>
    </div>

    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex={0} units="ether" precision={6} />
    </div>

    <div className="section">
      <h2>SportsBook</h2>
      <p>
        This shows a simple ContractData component with no arguments, along with
        a form to set its value.        
    uint256 public minFee = 10 finney;
    uint256 public minBet = 30 finney;
    uint256 public precision = 1 ether;
    uint256 public profit;
    uint256 public totalPool;
    uint256 public SAN_FRANCISCO_49ERS_pool;
    uint256 public KANSAS_CITY_CHIEFS_pool;
    uint32 public SAN_FRANCISCO_49ERS_bettors;
    uint32 public KANSAS_CITY_CHIEFS_bettors;
    uint8 public SAN_FRANCISCO_49ERS_score;
    uint8 public KANSAS_CITY_CHIEFS_score;
      </p>
      <p>
        <strong>minFee: </strong><ContractData contract="SportsBook" method="minFee" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="minBet" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="precision" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="profit" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="totalPool" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_pool" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_pool" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_bettors" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_bettors" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="SAN_FRANCISCO_49ERS_score" />
        <strong>minFee: </strong><ContractData contract="SportsBook" method="KANSAS_CITY_CHIEFS_score" />
      </p>
      <ContractForm contract="SportsBook" method="set" />
    </div>

    <div className="section">
      <h2>SportsBook</h2>
      <p>
        Here we have a form with custom, friendly labels. Also note the token
        symbol will not display a loading indicator. We've suppressed it with
        the <code>hideIndicator</code> prop because we know this variable is
        constant.
      </p>
      <p>
        <strong>Total Supply: </strong>
        <ContractData
          contract="SportsBook"
          method="totalSupply"
          methodArgs={[{ from: accounts[0] }]}
        />{" "}
        <ContractData contract="SportsBook" method="symbol" hideIndicator />
      </p>
      <p>
        <strong>My Balance: </strong>
        <ContractData
          contract="SportsBook"
          method="balanceOf"
          methodArgs={[accounts[0]]}
        />
      </p>
      <h3>Send Tokens</h3>
      <ContractForm
        contract="SportsBook"
        method="transfer"
        labels={["To Address", "Amount to Send"]}
      />
    </div>
    <div className="section">
      <h2>SportsBook</h2>
      <p>
        Finally this contract shows data types with additional considerations.
        Note in the code the strings below are converted from bytes to UTF-8
        strings and the device data struct is iterated as a list.
      </p>
      <p>
        <strong>String 1: </strong>
        <ContractData contract="SportsBook" method="string1" toUtf8 />
      </p>
      <p>
        <strong>String 2: </strong>
        <ContractData contract="SportsBook" method="string2" toUtf8 />
      </p>
      <strong>Single Device Data: </strong>
      <ContractData contract="SportsBook" method="singleDD" />
    </div>
  </div>
);
