pragma solidity ^0.5.0;

import "./Escrow.sol";
import "./WhitelistAdminRole.sol";

/**
 * @title ConditionalEscrow
 * @dev Base abstract escrow to only allow withdrawal if a condition is met.
 * @dev Intended usage: See Escrow.sol. Same usage guidelines apply here.
 */
contract ConditionalEscrow is Escrow, WhitelistAdminRole {

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

    bool public gameStarted;
    bool public gameEnded;

    Team public winningTeam;

    enum Team{
        NONE,
        SAN_FRANCISCO_49ERS,
        KANSAS_CITY_CHIEFS
    }

    mapping(address => Team) public myTeam;

    function scores() view public returns (uint8,uint8) {
        return (SAN_FRANCISCO_49ERS_score, KANSAS_CITY_CHIEFS_score);
    }    

    function reportScoreForSanFrancisco(uint8 score) public onlyWhitelistAdmin {
        SAN_FRANCISCO_49ERS_score += score;
    }

    function reportScoreForKansasCity(uint8 score) public onlyWhitelistAdmin {
        KANSAS_CITY_CHIEFS_score += score;
    }
    
    function setWinningTeam() public onlyWhitelistAdmin {
        SAN_FRANCISCO_49ERS_score > KANSAS_CITY_CHIEFS_score
            ? winningTeam = Team.SAN_FRANCISCO_49ERS
            : winningTeam = Team.KANSAS_CITY_CHIEFS;
        gameEnded = true;
    }

    function myBetWasPlaced() public view returns (bool) {
        return depositsOf(msg.sender) > 0;
    }

    function myTeamWon() public view returns (bool) {
        Team team = myTeam[msg.sender];
        return team != Team.NONE && team == winningTeam;
    }

    function claimPayout() public {
        require(gameEnded,"The game hasn't ended yet!");
        require(myBetWasPlaced(),"You didn't place a bet.");
        require(myTeamWon(),"Sorry, you didn't win :'(");
        uint256 bet = depositsOf(msg.sender);
        uint256 ratio = totalPool.mul(precision);
        uint256 payout = bet.mul(ratio).div(precision);
        withdraw(msg.sender, payout);
    }

    function bet(Team chosenTeam) public payable returns (bool) {
        require(!gameStarted,"Too late, the game has already started!");
        require(chosenTeam != Team.NONE,"Please enter 1 to bet for San Francisco or 2 to bet for Kansas City.");
        require(msg.value >= minBet,"Please send at least 0.03 ETH.");
        if (depositsOf(msg.sender) == 0)
            myTeam[msg.sender] = chosenTeam;
        uint256 fee = msg.value.div(20);
        uint256 betAmount = minFee < fee
            ? msg.value.sub(fee)
            : msg.value.sub(minFee);
        chosenTeam == Team.SAN_FRANCISCO_49ERS
            ? SAN_FRANCISCO_49ERS_pool = SAN_FRANCISCO_49ERS_pool.add(betAmount)
            : KANSAS_CITY_CHIEFS_pool = KANSAS_CITY_CHIEFS_pool.add(betAmount);
        totalPool = totalPool.add(betAmount);        
        deposit(msg.sender,betAmount);
    }
}
