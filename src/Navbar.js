import React, { Children } from "react";
import { GiWallet } from "react-icons/gi";
import { MdContentCopy } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { useContext } from "react";
import contractContext from "./context/contractContext";
import logo from "./assets/1.png";

const Navbar = () => {
  const a = useContext(contractContext);
  const [Address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isConnected, setisConnected] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const btnhandler = async () => {
    console.log(a);
    // console.log('Requesting account...');
    // const web3 = await getWeb3();
    // console.log(web3)
    // console.log("ASdasd")
    // // console.log(web3)
    // // await loadWeb3Contract(web3); // contract interective point
    // await loadWeb3Account(web3); // current connected wallet
  };

  const getbalance = (address) => {
    // Requesting balance method
    setAddress(address);
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => setBalance(ethers.utils.formatEther(balance)));
  };

  const handleClick = () => {
    setIsHovering(!isHovering);
  };

  function ParseFloat(str, val) {
    str = str.toString();
    str = str.slice(0, str.indexOf(".") + val + 1);
    return Number(str);
  }

  return (
    <header>
      <div className="container">
        <img src={logo} className="mainLogo" alt="" />

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="nfl">NBA</Link>
            </li>
            <li>
              <Link to="mlb">MLB</Link>
            </li>
            <li>
              <Link to="nba">NFL</Link>
            </li>

            {isConnected ? (
              <>
                <li className="address" style={{ color: "white" }}>
                  <MdContentCopy
                    className="copy"
                    w
                    onClick={() => navigator.clipboard.writeText(Address)}
                    size={25}
                  />
                  {Address.slice(0, 5)}...{Address.slice(39, 42)}
                </li>

                <li style={{ color: "white" }}>
                  <GiWallet onClick={handleClick} color="skyblue" size={50} />
                  {isHovering && (
                    <div className="wallet-balance" style={{ color: "white" }}>
                      {ParseFloat(balance.toString(), 5)}
                      <FaEthereum color="skyblue" />
                    </div>
                  )}
                </li>

                <li>
                  <img
                    src="https://avatars.dicebear.com/api/pixel-art/hehe.svg"
                    alt=""
                  />
                </li>
              </>
            ) : (
              <GiWallet color="white" onClick={btnhandler} size={45} />
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
