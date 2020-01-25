pragma solidity ^0.5.0;

import "./Escrow.sol";
import "./WhitelistAdminRole.sol";

/**
 * @title ConditionalEscrow
 * @dev Base abstract escrow to only allow withdrawal if a condition is met.
 * @dev Intended usage: See Escrow.sol. Same usage guidelines apply here.
 */
contract ConditionalEscrow is Escrow, WhitelistAdminRole {

    uint256 minFee = 10 finney;
    uint256 minBet = 30 finney;

    Team winningTeam;

    enum Team{
        SAN_FRANCISCO_49ERS,
        KANSAS_CITY_CHIEFS
    }

    mapping(uint8 => uint8) public scores;
    mapping(address => Team) public myTeam;

    function reportScore(Team scoringTeam, uint8 score) public onlyOwner {
        scores[uint8(scoringTeam)] += score;
    }

    function myBetWasPlaced() public view returns (bool) {
        return _deposits[msg.sender] > 0;
    }

    /**
    * @dev Returns whether an address is allowed to withdraw their funds. To be
    * implemented by derived contracts.
    * @param payee The destination address of the funds.
    */
    function myTeamWon() public view returns (bool) {
        require(myBetWasPlaced(),"You didn't place a bet.");
        return myTeam[msg.sender] == winningTeam;
    }

    function withdraw() public {
        require(myTeamWon(),"Sorry, you didn't win :'(");
        super.withdraw(msg.sender);
    }

    function bet(Team chosenTeam) public payable returns (bool) {
        require(msg.value > minBet,"Please send at least 0.03 ETH.");
        myTeam[msg.sender] = chosenTeam;
        uint256 fee = msg.value.div(20);
        uint256 betAmount = minFee < fee
            ? msg.value.sub(fee)
            : msg.value.sub(minFee);
        deposit(msg.sender,betAmount);
    }
}
