pragma solidity ^0.5.0;

import "./WhitelistAdminRole.sol";
import "./SafeMath.sol";
import "./ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
    using SafeMath for uint256;

    event Deposited(address indexed payee, uint256 weiAmount);
    event Withdrawn(address indexed payee, uint256 weiAmount);

    mapping(address => uint256) private _deposits;

    function depositsOf(address payee) public view returns (uint256) {
        return _deposits[payee];
    }

    /**
    * @dev Stores the sent amount as credit to be withdrawn.
    * @param payee The destination address of the funds.
    */
    function deposit(address payee, uint256 amount) public payable {
        _deposits[payee] = _deposits[payee].add(amount);
        emit Deposited(payee, amount);
    }

    /**
    * @dev Withdraw accumulated balance for a payee.
    * @param payee The address whose funds will be withdrawn and transferred to.
    */
    function withdraw(address payable payee, uint256 amount) public nonReentrant returns (bool success) {
        success = payee.send(amount);
        if(success)
            emit Withdrawn(payee, amount);
    }
}

/**
 * @title SportsBook
 * @dev Base abstract escrow to only allow withdrawal if a condition is met.
 * @dev Intended usage: See Escrow.sol. Same usage guidelines apply here.
 */
contract SportsBook is Escrow, WhitelistAdminRole {

    uint256 public minFee = 10 finney;
    uint256 public minBet = 30 finney;
    uint256 public precision = 1 ether;
    uint256 public profit_for_SAN_FRANCISCO_49ERS_bettors;
    uint256 public profit_for_KANSAS_CITY_CHIEFS_bettors;
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

    mapping(address => Team) public teamOf;

    function scores() view public returns (uint8,uint8) {
        return (SAN_FRANCISCO_49ERS_score, KANSAS_CITY_CHIEFS_score);
    }    

    function setScoreForSanFrancisco(uint8 score) public onlyWhitelistAdmin {
        SAN_FRANCISCO_49ERS_score = score;
    }

    function setScoreForKansasCity(uint8 score) public onlyWhitelistAdmin {
        KANSAS_CITY_CHIEFS_score = score;
    }

    function reportGameStarted() public onlyWhitelistAdmin {
        gameStarted = true;
    }

    function reportGameEnded() public onlyWhitelistAdmin {
        require(gameStarted,"The game can't end if it hasn't started yet.");
        SAN_FRANCISCO_49ERS_score > KANSAS_CITY_CHIEFS_score
            ? winningTeam = Team.SAN_FRANCISCO_49ERS
            : winningTeam = Team.KANSAS_CITY_CHIEFS;
        gameEnded = true;
    }

    function howMuchHaveIBet() public view returns (uint256) {
        return depositsOf(msg.sender);
    }

    function myBetWasPlaced() public view returns (bool) {
        return howMuchHaveIBet() > 0;
    }

    function teamOfWon() public view returns (bool) {
        Team team = teamOf[msg.sender];
        return team != Team.NONE && team == winningTeam;
    }

    function claimPayout() public returns (bool) {
        require(gameEnded,"The game hasn't ended yet!");
        require(myBetWasPlaced(),"You didn't place a bet.");
        require(teamOfWon(),"Sorry, you didn't win :'(");
        uint256 bet = depositsOf(msg.sender);
        uint256 numerator = bet.mul(totalPool).mul(precision);
        uint256 winnersPool = SAN_FRANCISCO_49ERS_pool > KANSAS_CITY_CHIEFS_pool
            ? SAN_FRANCISCO_49ERS_pool : KANSAS_CITY_CHIEFS_pool;
        uint256 denominator = winnersPool.mul(precision);
        uint256 payout = numerator.div(denominator);
        return withdraw(msg.sender, payout);
    }

    function bet(Team chosenTeam) public payable returns (bool) {
        require(!gameStarted,"Too late, the game has already started!");
        require(chosenTeam != Team.NONE,"Please enter 1 to bet for San Francisco or 2 to bet for Kansas City.");
        require(msg.value >= minBet,"Please send at least 0.03 ETH.");
        teamOf[msg.sender] = chosenTeam;
        uint256 fee = msg.value.div(20);
        uint256 betAmount = minFee < fee
            ? msg.value.sub(fee)
            : msg.value.sub(minFee);
        chosenTeam == Team.SAN_FRANCISCO_49ERS
            ? SAN_FRANCISCO_49ERS_pool = SAN_FRANCISCO_49ERS_pool.add(betAmount)
            : KANSAS_CITY_CHIEFS_pool = KANSAS_CITY_CHIEFS_pool.add(betAmount);
        totalPool = totalPool.add(betAmount);
        deposit(msg.sender,betAmount);
        profit_for_SAN_FRANCISCO_49ERS_bettors = totalPool.mul(precision).div(SAN_FRANCISCO_49ERS_pool);
        profit_for_KANSAS_CITY_CHIEFS_bettors = totalPool.mul(precision).div(KANSAS_CITY_CHIEFS_pool);
    }
}
