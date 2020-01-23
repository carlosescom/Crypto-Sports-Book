pragma solidity ^0.5.0;

import "./Escrow.sol";

/**
 * @title ConditionalEscrow
 * @dev Base abstract escrow to only allow withdrawal if a condition is met.
 * @dev Intended usage: See Escrow.sol. Same usage guidelines apply here.
 */
contract ConditionalEscrow is Escrow {

    Team winningTeam;

    enum Team{
        SAN_FRANCISCO_49ERS,
        KANSAS_CITY_CHIEFS
    }
    
    uint team1Score;
    uint team2Score;

    function reportTouchdown(Team scoringTeam) public onlyOwner {
        scoringTeam == Team.SAN_FRANCISCO_49ERS 
            ? team1Score += 7
            : team2Score += 7;
    }

    /**
    * @dev Returns whether an address is allowed to withdraw their funds. To be
    * implemented by derived contracts.
    * @param payee The destination address of the funds.
    */
    function myTeamWon() public view returns (bool) {
        return _deposits[msg.sender] > 0 && team[msg.sender] == winningTeam;
    }

    function withdraw() public {
        require(myTeamWon(),"Sorry, you didn't win :'(");
        super.withdraw(msg.sender);
    }
}
