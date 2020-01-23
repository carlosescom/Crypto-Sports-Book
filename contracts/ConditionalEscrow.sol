pragma solidity ^0.5.0;

import "./Escrow.sol";

/**
 * @title ConditionalEscrow
 * @dev Base abstract escrow to only allow withdrawal if a condition is met.
 * @dev Intended usage: See Escrow.sol. Same usage guidelines apply here.
 */
contract ConditionalEscrow is Escrow {
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
