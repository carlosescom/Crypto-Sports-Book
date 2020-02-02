import Web3 from "web3";
import SportsBook from "./contracts/SportsBook.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3(window.web3.currentProvider),
  },
  contracts: [SportsBook],
  events: {
    SportsBook: ["Deposited"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
