// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract Pool{


    IERC20 public projectToken;

    address USDTTokenAddres = 0xd9145CCE52D386f254917e481eB44e9943F39138;
    address BSDTTokenAddres = 0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c;

    

  //          address       MATCHID=>Choice
    mapping(address=>mapping(uint=>uint)) public ChoiceSheet;  // make it private
    address[] public BetterAddresses; // make it private

    address[] public WinnersAddresses; // make it private

  
    uint[] public Points;  // make it private
    address public owner;
    uint PoolBetAmount;
    uint PoolCurrency;
    
    constructor(uint amount, uint currency, address tokenAddr){
        owner = msg.sender;
        require(amount>0, "Invalid amount");
        PoolBetAmount = amount;
        PoolCurrency = currency;
        if(PoolCurrency==1){
            projectToken = IERC20(tokenAddr); // make it dynamic this is for testing for now
        }else if(PoolCurrency==2){
            projectToken = IERC20(BSDTTokenAddres);
        }
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "error-only-owner");
        _;
    }

    



    function isAllowed(address BetterAddress) view public returns(uint){
        return ChoiceSheet[BetterAddress][0];
    }



    function AddBetterAddress(address BetterAddress) external  onlyOwner   {
        require(ChoiceSheet[BetterAddress][0] != 1, "You are already listed");
        bool success = projectToken.transferFrom(BetterAddress, address(this), PoolBetAmount);
        require(success == true, "Payment Failed");
        BetterAddresses.push(BetterAddress);
        ChoiceSheet[BetterAddress][0] = 1;
    }

    function AddChoice(address BetterAddress, uint[] memory matchID, uint[] memory teamID) external onlyOwner {
        require(ChoiceSheet[BetterAddress][0] == 1, "You are not listed in betting list");
        for(uint i = 0; i < matchID.length ; i++){
            ChoiceSheet[BetterAddress][matchID[i]] = teamID[i];
        }
        
    }

    function GetChoice(address BetterAddress, uint matchID)  external view onlyOwner returns(uint) {
        require(ChoiceSheet[BetterAddress][0] == 1, "You are not listed in betting list");
        return ChoiceSheet[BetterAddress][matchID];
    }

    function DistributeRewards(uint[] memory MatchIDs, uint[] memory WinningTeamIDs) external onlyOwner{
        uint pts;
        for (uint i = 0; i < BetterAddresses.length; i++) 
        {
            for (uint j = 0; j < MatchIDs.length; j++) 
            {
                if(ChoiceSheet[BetterAddresses[i]][MatchIDs[j]] == WinningTeamIDs[j]){
                    pts++;
                }
            }
            Points.push(pts);
            pts = 0;   
        }
        ChooseWinners();
    }

    function ChooseWinners() internal onlyOwner{
        uint n = Points.length;
        uint NoOfWinners;
        uint[] memory arr = new uint[](n);                // score
        address[] memory addr = new address[](n);        //  better addresses 

        uint i;

        for(i=0; i<n; i++) {
            arr[i] = Points[i];
            addr[i] = BetterAddresses[i];
        }

        uint[] memory stack = new uint[](n+2);

        //Push initial lower and higher bound
        uint top = 1;
        stack[top] = 0;
        top = top + 1;
        stack[top] = n-1;

        //Keep popping from stack while is not empty
        while (top > 0) {

            uint h = stack[top];
            top = top - 1;
            uint l = stack[top];
            top = top - 1;

            i = l;
            uint x = arr[h];

            for(uint j=l; j<h; j++){
                if (arr[j] <= x) {
                    (arr[i], arr[j]) = (arr[j],arr[i]);
                    address temper = addr[i];
                    addr[i] = addr[j];
                    addr[j] = temper;
                    // (addr[i], addr[j]) = (addr[j],addr[i]);
                    i = i + 1;
                }
            }
            (arr[i], arr[h]) = (arr[h],arr[i]);
            address temper123 = addr[i];
            addr[i] = addr[h];
            addr[h] = temper123;
      
            uint p = i;

            //Push left side to stack
            if (p > l + 1) {
                top = top + 1;
                stack[top] = l;
                top = top + 1;
                stack[top] = p - 1;
            }

            //Push right side to stack
            if (p+1 < h) {
                top = top + 1;
                stack[top] = p + 1;
                top = top + 1;
                stack[top] = h;
            }
        }

        for (i=n-1; i>0; i--) {
            if(arr[i] == arr[i-1]){
                WinnersAddresses.push(addr[i]);
                WinnersAddresses.push(addr[i-1]);
                NoOfWinners = NoOfWinners + 2;
            }else if(NoOfWinners==0){
                NoOfWinners++;
                WinnersAddresses.push(addr[i-1]);
                break;
            }
            else{
                break;
            }
        }

        for(i=0; i<n; i++) {
            Points[i] = arr[i];
            BetterAddresses[i] = addr[i];
        }

        uint amountPerWinner = projectToken.balanceOf(address(this)) / NoOfWinners;

        for (i=0; i < WinnersAddresses.length; i++) {
            bool success = projectToken.transfer(WinnersAddresses[i], amountPerWinner);
            require(success==true, "bad payment");
        }
        // destroy();
        
    }

    
    
    function destroy() public onlyOwner{
        selfdestruct(payable(owner));
    }


//--------------------------------TESTING PURPOSE------------------------------------------------//
    function getwinnerAddress(uint i) external view returns(address){
        return WinnersAddresses[i];
    }

    function getWinner(uint i) view public returns(address){
        return BetterAddresses[i];
    }

    function getWinnerScore(uint i) view public returns(uint){
        return Points[i];
    }

    


    
}
    

contract AdminPanel {

    IERC20 public projectToken;

    address public owner;
    
    mapping(uint=>mapping(uint=>address)) public PaymentMethod; // pools addresses

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "error-only-owner");
        _;
    }

    
    // ------------------------------- PUBLIC POOLS --------------------------------- //

    function createPool(uint amount, uint currency, address TokenAddr) onlyOwner public{       // only owner can create pool
        Pool pool = new Pool(amount*(1**8), currency, TokenAddr);
        PaymentMethod[currency][amount] = address(pool); //saving pool address by currency and amount
    }

    function JoinPool(uint amount, uint currency) public {                  // to join  pool
        Pool(PaymentMethod[currency][amount]).AddBetterAddress(msg.sender);
    }


    function addChoice(uint amount, uint currency, uint[] memory MatchID, uint[] memory TeamID) public { // adding choice
        Pool(PaymentMethod[currency][amount]).AddChoice(msg.sender, MatchID, TeamID);
    }

    function getChoices(uint amount, uint currency, uint MatchID) public view returns (uint) {  // anyone can check choice of anyone
        return Pool(PaymentMethod[currency][amount]).GetChoice(msg.sender, MatchID);
    }
    
    function DistributeRewards(uint[] memory matchIDs, uint[] memory winningTeamIds, uint amount, uint currency) public onlyOwner {          // distribute rewards
        Pool(PaymentMethod[currency][amount]).DistributeRewards(matchIDs, winningTeamIds);
    }

    function isAllowed(uint amount, uint currency) public view returns(bool){        //check if current user is allowed or not
        if(Pool(PaymentMethod[currency][amount]).isAllowed(msg.sender)==1) {
            return true;
        }else{ 
        return false;
        }
    }

    //----------------------------------------PUBLIC POOLS TESTING FUNCTIONS---------------------------------------------------------//

    function getWinner(uint amount, uint currency, uint i) view public returns(address){   // testing functions
        return Pool(PaymentMethod[currency][amount]).getWinner(i);
    }

    function getWinnerscore(uint amount, uint currency, uint i) view public returns(uint){   // testing functions
        return Pool(PaymentMethod[currency][amount]).getWinnerScore(i);
    }

    function getWinnerAddress(uint amount, uint currency, uint i) public view returns(address) {   // testing functions
        return Pool(PaymentMethod[amount][currency]).getwinnerAddress(i);
    }

    function CheckArray(uint[] memory MatchIDs) pure public returns(uint){
        return MatchIDs.length;
    }

    //----------------------------------------- 1 V 1 POOLS Functions ---------------------------------------------------------------//

    struct Match{
        uint User1Choice;
        address User1Addr;
        uint User2Choice;
        address User2Addr;
        uint amount;
    }

    mapping(uint => Match) public MatchDetails;


    function AddMatchLeft(uint MatchID, uint Choice, uint amount) public{
        require(MatchDetails[MatchID].User1Choice==0, "already placed");
        if(MatchDetails[MatchID].User1Choice==0){
            require(MatchDetails[MatchID].User2Addr != msg.sender, "You have already signed");
            MatchDetails[MatchID].User1Choice = Choice;
            require(MatchDetails[MatchID].User1Choice != MatchDetails[MatchID].User2Choice, "Already Signed");
            MatchDetails[MatchID].User1Addr = msg.sender;
            if(MatchDetails[MatchID].amount==0){
                MatchDetails[MatchID].amount = amount;
            }else if(MatchDetails[MatchID].amount>0){
                require(MatchDetails[MatchID].amount == amount, "Please Select The Exact Amount  ");
            }
        }
    }

    function AddMatchRight(uint MatchID, uint Choice, uint amount) public {
        require(MatchDetails[MatchID].User2Choice==0, "already placed");
        if(MatchDetails[MatchID].User2Choice==0){
            require(MatchDetails[MatchID].User1Addr != msg.sender, "You have already signed");
            MatchDetails[MatchID].User2Choice = Choice;
            require(MatchDetails[MatchID].User1Choice != MatchDetails[MatchID].User2Choice, "Already Signed");
            MatchDetails[MatchID].User2Addr = msg.sender;
            if(MatchDetails[MatchID].amount==0){
                MatchDetails[MatchID].amount = amount;
            }else if(MatchDetails[MatchID].amount>0){
                require(MatchDetails[MatchID].amount == amount, "Please Select The Exact Amount  ");
            }
        }
    }

    function getLeftMatch(uint MatchID) view public returns (uint){
        return MatchDetails[MatchID].User1Choice;
    }

    function getRightMatch(uint MatchID) view public returns (uint){
        return MatchDetails[MatchID].User2Choice;
    }


    
    function getMatch(uint MatchID) view public returns(Match memory){
        return MatchDetails[MatchID];
    }

    function getMatchAmount(uint MatchID) view public returns(uint) {
        return MatchDetails[MatchID].amount;
    }

    function getMatchOfCurrentUser(uint MatchID) view public returns(uint, uint){
        if(MatchDetails[MatchID].User1Addr == msg.sender){
            return (MatchDetails[MatchID].User1Choice, MatchDetails[MatchID].amount);
        }else if(MatchDetails[MatchID].User2Addr == msg.sender){
            return (MatchDetails[MatchID].User2Choice, MatchDetails[MatchID].amount);
        }else{
            return (0,0);
        }
    }

   function DecideWinner(uint MatchID, uint WinnerTeamID) public {
    
       if(MatchDetails[MatchID].User1Choice == WinnerTeamID){
           // transfer the amount to user 1
           delete MatchDetails[MatchID];
       }else if(MatchDetails[MatchID].User2Choice == WinnerTeamID){
           // transfer the amount to user 2
           
           delete MatchDetails[MatchID];
       }
   }
    function getAddress() public view returns(address) {
        return msg.sender;
    }


}