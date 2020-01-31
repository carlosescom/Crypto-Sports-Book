# Crypto Sports Book
---

This is a simple implementation of moneylines in Ethereum. You can use it to bet for your favorite team to win the Super Bowl LIV.

## How to test it
---
In a terminal window pointing at the project root directory, run the following commands:

```bash
truffle test ./test/SportsBook.test.js
```

## How to run it
---

### Start an instance of Ganache

Setup an instance of Ganache to run and listen through port 8545.

### Start the web app server

In a terminal window pointing at the project root directory, run the following commands:

```Bash
cd app; npm start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Gamble!

The UI is configured to bet only a fixed amount of `30 finney`, which is the minimum allowed bet.

To submit a bet, simply follow these steps:
1. Scroll down to the section with the title "Submit your bets!".
2. Chose your team by entring either `1` or `2` in the input field.
3. Submit team scores and .



Alternatively you can run the following commands on a Truffle console.

Theres already an instance of the contract that has already been deployed to the Ropsten testnet at the following address `0x69b9DC056FFb052a2fDF7C3112b484Bd27e75eaE`.

```Bash
truffle console --network ganache
```

Within the Truffle console copy and paste all of the following commands.

```JavaScript
let SB = await SportsBook.at('0x69b9DC056FFb052a2fDF7C3112b484Bd27e75eaE')
let A = await web3.eth.getAccounts()
SB.contract.methods.bet(1).send({from:A[0],value:30000000000000000})
SB.contract.methods.bet(2).send({from:A[1],value:50000000000000000})
```

