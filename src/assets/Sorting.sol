// // SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;

// contract Sorting {
    
// //          address       MATCHID=>Choice
//     mapping(address=>mapping(uint=>uint)) public ChoiceSheet;
//     // mapping(address=>uint) public points;
//     uint public betters = 10;
//     address[] public BetterAddresses;
//     uint[] public Points;

//     uint public pts;

//     uint public max;
//     address public winner;

//     function AddBetterAddress(address BetterAddress) public {
//         BetterAddresses.push(BetterAddress);
//     }

//     function AddChoice(uint matchID, uint teamID) public{
//         ChoiceSheet[msg.sender][matchID] = teamID;
//     }

//     function GetChoice(uint matchID) public view returns(uint) {
//         return ChoiceSheet[msg.sender][matchID];
//     }

//     uint[] public MatchIDs = [11016, 11017, 11018, 11019, 11020, 11021, 11022, 11023, 11024, 11025, 11026, 11027, 11028, 11029, 11030, 11031, 11032, 11033, 11034, 11035, 11036, 11037, 11038, 11039, 11040, 11041, 11042, 11043, 11044, 11045, 11046, 11047, 11048, 11049];
//     uint[] public WinningTeamIDs = [6, 25, 23, 17, 30, 22, 41, 27, 20, 9, 25, 26, 6, 31, 11, 7, 15, 27, 20, 4, 22, 30, 9, 19, 25, 14, 26, 38, 24, 4, 23, 8, 9, 30];
//     uint public StartingMatch = MatchIDs[0];

    
    
//     function CLAIM() public {
//         for (uint i = 0; i < BetterAddresses.length; i++) 
//         {

//             for (uint j = 0; j < MatchIDs.length; j++) 
//             {
//                 if(ChoiceSheet[BetterAddresses[i]][MatchIDs[j]] == WinningTeamIDs[j]){
//                     pts++;
//                 }
//             }
//             // points[BetterAddresses[i]] = pts;
//             Points.push(pts);
//             pts = 0;
            
//         }

        


        

//     }

//     function sort()  public {

//         uint n = Points.length;
//         // uint[] memory arr = new uint[](n);
//         uint i;

//     // for(i=0; i<n; i++) {
//     //   arr[i] = data[i];
//     // }

//     uint[] memory stack = new uint[](n+2);

//     //Push initial lower and higher bound
//     uint top = 1;
//     stack[top] = 0;
//     top = top + 1;
//     stack[top] = n-1;

//     //Keep popping from stack while is not empty
//     while (top > 0) {

//       uint h = stack[top];
//       top = top - 1;
//       uint l = stack[top];
//       top = top - 1;

//       i = l;
//       uint x = Points[h];
      

//       for(uint j=l; j<h; j++){
//         if  (Points[j] <= x) {
//           //Move smaller element
          
//             (Points[i], Points[j]) = (Points[j],Points[i]);
//             address temper = BetterAddresses[i];
//             BetterAddresses[i] = BetterAddresses[j];
//             BetterAddresses[j] = temper;
//             // (addr[i], addr[j]) = (addr[j],addr[i]);
//             i = i + 1;
//         }
//       }
//       (Points[i], Points[h]) = (Points[h],Points[i]);
//         address temper123 = BetterAddresses[i];
//             BetterAddresses[i] = BetterAddresses[h];
//             BetterAddresses[h] = temper123;
      
//       uint p = i;

//       //Push left side to stack
//       if (p > l + 1) {
//         top = top + 1;
//         stack[top] = l;
//         top = top + 1;
//         stack[top] = p - 1;
//       }

//       //Push right side to stack
//       if (p+1 < h) {
//         top = top + 1;
//         stack[top] = p + 1;
//         top = top + 1;
//         stack[top] = h;
//       }
//     }

//     // for (uint k=n-1; k>0; k--) 
//     // {
//     //   if(arr[k] == arr[k-1]){
//     //     NoOfWinners++;
//     //   }else{
//     //     break;
//     //   }
//     // }

//   }

// }