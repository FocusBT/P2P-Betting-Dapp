import React from "react";
import contractContext from "./contractContext";
// import getWeb3 from "../getWeb";
import AdminPanel from "../contracts/AdminPanel.json";
import { useState, useEffect } from "react";
import MyToken from "../contracts/MyToken.json";
import Web3 from "web3";

const ContractState = (props) => {
  var web3;
  const [Contract, setContract] = useState();
  const [Account, setAccount] = useState("");
  // const [web3, setWeb3] = useState();
  const [data, setData] = useState([]);
  const [tokenContract, setTokenContract] = useState();

  const [currency, setCurrency] = useState();
  const [poolAmount, setPoolAmount] = useState();

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e87e2a9e76msh786bfbc4a06be10p13f47ajsn70ea9376873d",
      "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    },
  };

  const connect = async () => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await web3.eth
          .requestAccounts()
          .then((accounts) => setAccount(accounts));
        // Request account access if needed
        await window.ethereum.enable();
        window.ethereum.on("accountsChanged", function (accounts) {
          console.log("accountsChanges", accounts);
          setAccount(accounts);
        });

        // detect Network account change
        window.ethereum.on("networkChanged", function (networkId) {
          console.log("networkChanged", networkId);
        });

        // Accounts now exposed
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId(); // to get which network we are connected
    const networkData = AdminPanel.networks[networkId];
    if (networkData) {
      const abi = AdminPanel.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract); // NOT WORKING SINCE IT IS IN ASYNC FUNCTION THATS WHY I COULDNT FIND SOLUTION FOR THAT.
      return contract;
    } else {
      console.log("error occured please check networkData");
      return null;
    }
  };

  const loadTokenContract = async (web3) => {
    const networkId = await web3.eth.net.getId(); // to get which network we are connected
    const networkData = MyToken.networks[networkId];
    if (networkData) {
      const TokenAbi = MyToken.abi;
      const TokenAddress = networkData.address;
      const TokenContract = new web3.eth.Contract(TokenAbi, TokenAddress);
      setTokenContract(TokenContract);
      return TokenContract;
    } else {
      console.log("error occured please check networkData");
      return null;
    }
  };

  const fetchData = async () => {
    await fetch("https://api-nba-v1.p.rapidapi.com/games?season=2022", options)
      .then((response) => response.json())
      .then((data) => {
        setData(data.response);
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setCurrency(1); // for testing purpose
    setPoolAmount(1); // for testing purpose
    const fetchContractAndAccount = async () => {
      await connect();
      await loadWeb3Contract(web3); // contract interective point
      await loadTokenContract(web3);
    };

    fetchContractAndAccount();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Public Pool Contract: ", Contract);
    console.log("Token Contract: ", tokenContract);
  }, [Contract, tokenContract]);

  return (
    <contractContext.Provider
      value={{
        Contract,
        web3,
        Account,
        data,
        tokenContract,
        setCurrency,
        setPoolAmount,
        currency,
        poolAmount,
      }}
    >
      {props.children}
    </contractContext.Provider>
  );
};

export default ContractState;
