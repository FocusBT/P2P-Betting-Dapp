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

    uint[] public MatchIDs = [11016, 11017, 11018, 11019, 11020, 11021, 11022, 11023, 11024, 11025, 11026, 11027, 11028, 11029, 11030, 11031, 11032, 11033, 11034, 11035, 11036, 11037, 11038, 11039, 11040, 11041, 11042, 11043, 11044, 11045, 11046, 11047, 11048, 11049];
    uint[] public WinningTeamIDs = [6, 25, 23, 17, 30, 22, 41, 27, 20, 9, 25, 26, 6, 31, 11, 7, 15, 27, 20, 4, 22, 30, 9, 19, 25, 14, 26, 38, 24, 4, 23, 8, 9, 30];

    constructor(uint amount, uint currency){
        owner = msg.sender;
        require(amount>0, "Invalid amount");
        PoolBetAmount = amount;
        PoolCurrency = currency;
        if(PoolCurrency==1){
            projectToken = IERC20(USDTTokenAddres);
        }else if(PoolCurrency==2){
            projectToken = IERC20(BSDTTokenAddres);
        }
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "error-only-owner");
        _;
    }

    function getWinner(uint i) view public returns(address){
        return BetterAddresses[i];
    }

    function getWinnerScore(uint i) view public returns(uint){
        return Points[i];
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

    function AddChoice(address BetterAddress, uint matchID, uint teamID) external onlyOwner {
        require(ChoiceSheet[BetterAddress][0] == 1, "You are not listed in betting list");
        ChoiceSheet[BetterAddress][matchID] = teamID;
    }

    function GetChoice(address BetterAddress, uint matchID)  external view onlyOwner returns(uint) {
        require(ChoiceSheet[BetterAddress][0] == 1, "You are not listed in betting list");
        return ChoiceSheet[BetterAddress][matchID];
    }

    function CLAIM() external onlyOwner{
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
        sort();
    }

    function sort() internal onlyOwner{

        uint n = Points.length;


        uint NoOfWinners;
        uint[] memory arr = new uint[](n);
        address[] memory addr = new address[](n);

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
        for (uint i=0; i < n; i++) {
            bool success = projectToken.transfer(WinnersAddresses[i], amountPerWinner);
            require(success==true, "bad payment");
        }
        // destroy();
    }

    
    
    function destroy() public onlyOwner{
        selfdestruct(payable(owner));
    }

    
}
    

contract AdminPanel {

    IERC20 public projectToken;

    address USDTTokenAddres = 0xd9145CCE52D386f254917e481eB44e9943F39138;
    address public owner;
    mapping(uint=>mapping(uint=>address)) public PaymentMethod;
    constructor(){
        owner = msg.sender;   
        projectToken = IERC20(USDTTokenAddres);
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "error-only-owner");
        _;
    }

    
    
    function createPool(uint amount, uint currency) onlyOwner public{
        Pool pool = new Pool(amount*(10**18), currency);
        PaymentMethod[currency][amount] = address(pool); //saving pool address by currency and amount
    }

    function addChoice(uint amount, uint currency, uint MatchID, uint TeamID) public {
        Pool(PaymentMethod[currency][amount]).AddChoice(msg.sender, MatchID, TeamID);
    }

    function getChoices(uint amount, uint currency, uint MatchID) public view returns (uint) {
        return Pool(PaymentMethod[currency][amount]).GetChoice(msg.sender, MatchID);
    }

    function JoinPool(uint amount, uint currency) public {
        Pool(PaymentMethod[currency][amount]).AddBetterAddress(msg.sender);
    }

    function isAllowed(uint amount, uint currency) public view returns(bool){
        if(Pool(PaymentMethod[currency][amount]).isAllowed(msg.sender)==1) {
            return true;
        }else{ 
        return false;
        }
    }

    function Claim(uint amount, uint currency) public onlyOwner {
        Pool(PaymentMethod[currency][amount]).CLAIM();
    }

    function getWinner(uint amount, uint currency, uint i) view public returns(address){
        return Pool(PaymentMethod[currency][amount]).getWinner(i);
    }

    function getWinnerscore(uint amount, uint currency, uint i) view public returns(uint){
        return Pool(PaymentMethod[currency][amount]).getWinnerScore(i);
    }

    function getWinnerAddress(uint amount, uint currency, uint i) public view returns(address) {   // for testing
        return Pool(PaymentMethod[amount][currency]).getwinnerAddress(i);
    }

    function sendAmount(uint amount, uint currency, uint winners)  public{
        Pool(PaymentMethod[amount][currency]).sendAmounts(winners);

    }

    // uint public NoOfWinners;
    // uint[] public arr;
    // address[] public WinnersAddresses;
    // address[] public addr;
    // function testing() public {
    //     uint i;
        
    //     addr.push(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4);
    //     addr.push(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
    //     addr.push(0xd9145CCE52D386f254917e481eB44e9943F39138);
        
    //     uint n = addr.length;
        
    //     arr.push(1);
    //     arr.push(2);
    //     arr.push(2);

        

        
    //     for (i=n-1; i>0; i--) {
    //         if(arr[i] == arr[i-1]){
    //             WinnersAddresses.push(addr[i]);
    //             WinnersAddresses.push(addr[i-1]);
    //             NoOfWinners = NoOfWinners + 2;
    //         }else if(NoOfWinners==0){
    //             NoOfWinners++;
    //             WinnersAddresses.push(addr[i-1]);
    //             break;
    //         }
    //         else{
    //             break;
    //         }
    //     }
    // }
    



}