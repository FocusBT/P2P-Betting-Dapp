# P2P Betting DApp

<picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://github.com/FocusBT/P2P-Betting-Dapp/blob/6a3c490ff82e19fcde0284e98dfaecc655576df1/src/assets/1.png">
 <source media="(prefers-color-scheme: light)" srcset="https://github.com/FocusBT/P2P-Betting-Dapp/blob/6a3c490ff82e19fcde0284e98dfaecc655576df1/src/assets/1.png">
 <img alt="P2P Betting Logo" src="https://github.com/FocusBT/P2P-Betting-Dapp/blob/6a3c490ff82e19fcde0284e98dfaecc655576df1/src/assets/1.png">
</picture>


## Overview
This repository contains the implementation of a Peer-to-Peer (P2P) betting decentralized application (DApp) named **P2P Betting**. This DApp is powered by the Ethereum network, integrating **Chainlink and off-chain APIs** to ensure trustless and automated operation.

The DApp allows users to place bets on various sports such as NBA, NBK, and more. The betting occurs in two types of pools: 1v1 Betting and Public Pools. A third type, Private Pools, is currently under development.


# Key Features

**1v1 Betting**: This feature displays all scheduled matches, and users can place bets on any team. Bets are displayed live on the website, showcasing the amount of bet placed on each team in a particular match. Other users can place the same amount of bet on the teams.

**Public Pools**: Public pools are a weekly play where users join by paying an entry fee a week prior. Once joined, users select their preferred teams in the scheduled games for the week. Each correct prediction earns a user 1 point. The users with the highest points from their predictions top the pool's ranking.

**Private Pools**: This feature is currently under development. It's anticipated to provide a more tailored betting experience to the users.

**Chainlink Integration**: We use Chainlink to automate the process of choosing the winners, ensuring a trustless, secure, and efficient environment for our users.

# Built With
1. Solidity ^0.8.4
2. OpenZeppelin Contracts
3. React
4. Web3.js
5. Chainlink


