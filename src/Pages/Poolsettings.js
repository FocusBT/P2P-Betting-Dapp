import React from "react";
import "./Poolsettings.css";
import { useState, useEffect, CSSProperties } from "react";
import { useContext } from "react";
import contractContext from "../context/contractContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";

const override = (CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
});
const Poolsettings = ({ setPool }) => {
  const navigate = useNavigate();
  const {
    Contract,
    Account,
    tokenContract,
    setCurrency,
    setPoolAmount,
    currency,
    poolAmount,
  } = useContext(contractContext);

  const [curr, setCurr] = useState("usdt");
  const [poolAmountToBet, setPoolAmountToBet] = useState(1);
  const [Temp, setTemp] = useState("public");
  const [hide, setHide] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // console.log(poolAmountToBet);
    setIsLoading(true);

    // // Contract.methods.AddMatch(11256, 37, 12000).send({ from: Account[0] });
    // Contract.methods.AddMatch(11256, 1, 12000).send({ from: Account[0] });
    // // Contract.methods.AddMatch(11257, 6, 12000).send({ from: Account[0] });
    // Contract.methods.AddMatch(11257, 19, 12000).send({ from: Account[0] });
    // // Contract.methods.AddMatch(11258, 30, 12000).send({ from: Account[0] });
    // Contract.methods.AddMatch(11258, 31, 12000).send({ from: Account[0] });
    // // Contract.methods.AddMatch(11259, 17, 12000).send({ from: Account[0] });
    // Contract.methods.AddMatch(11259, 30, 12000).send({ from: Account[0] });

    // const kli = await Contract.methods.getMatch(11244).call();
    // console.log(kli.amount);

    if (curr === "usdt") {
      if (Temp === "public") {
        const isAllowed = await Contract.methods
          .isAllowed(1, poolAmountToBet)
          .call({ from: Account[0] });

        console.log("first");
        if (isAllowed === true) {
          setIsLoading(false);
          navigate("/public", {
            state: { currency: currency, poolAmount: poolAmount },
          });
          // setPool(Temp);
        } else {
          const getPoolAddress = await Contract.methods
            .PaymentMethod(1, poolAmountToBet)
            .call();
          console.log(getPoolAddress);

          await tokenContract.methods
            .approve(getPoolAddress, 100000000)
            .send({ from: Account[0] }); //this is for testing

          await Contract.methods.JoinPool(poolAmountToBet, 1).send({
            from: Account[0],
          });
          setIsLoading(false);
          navigate("/public", {
            state: { currency: currency, poolAmount: poolAmount },
          });
        }
      } else if (Temp === "OneVOne") {
        navigate("/OneVOne");
      }
    }

    // console.log(Account);

    // for testing
    // tokenContract.methods
    //   .mint("0x30fE9255006F4a850d1c62fE871835aCeCF1b0BF", "10000000000000")
    //   .send({ from: Account[0] });

    // this commond will run
    // Contract.methods
    //   .createPool(1, 1, tokenContract.options.address)
    //   .send({ from: Account[0] });

    // console.log(Contract.methods.PaymentMethod(1, 1).call());

    // tokenContract.methods
    //   .approve("0x51e5aDC4CC18899C92E3c498F9E19d87dB33Bd23", 100000000)
    //   .send({ from: Account[0] });

    // console.log(tokenContract.methods.owner().call());

    setIsLoading(false);
  };

  useEffect(() => {
    if (Temp === "OneVOne") {
      setHide(false);
    } else {
      setHide(true);
    }
    console.log("checking");
  }, [Temp]);

  return (
    <>
      {isLoading ? (
        <ClipLoader size={150} cssOverride={override} />
      ) : (
        <div className="Maincontainer">
          <div className="form-input">
            <label for="dropdown">Select Type of Pool?</label>
            <select
              onChange={(e) => setTemp(e.target.value)}
              id="dropdown"
              name="pool"
              className="dropdown"
            >
              <option disabled value>
                Select an option
              </option>
              <option value="public">Public Pool</option>
              <option value="OneVOne">1 v 1 Bet</option>
            </select>
          </div>

          <div className="form-input">
            <label for="dropdown">Select Crypto Currency?</label>
            <select
              onChange={(e) => setCurr(e.target.value)}
              id="dropdown"
              name="currency"
              className="dropdown"
            >
              <option disabled value>
                Select an option
              </option>
              <option value="usdt">USDT</option>
              <option value="busd">BUSD</option>
            </select>
          </div>

          <div className="form-input">
            {hide ? (
              <>
                <label for="dropdown">Select Amount to Bet?</label>
                <select
                  onChange={(e) => setPoolAmountToBet(parseInt(e.target.value))}
                  id="dropdown"
                  name="poolAmountToBet"
                  className="dropdown"
                >
                  <option disabled value>
                    Select an option
                  </option>
                  <option value="1">$50</option>
                  <option value="2">$100</option>
                  <option value="3">$200</option>
                </select>
              </>
            ) : (
              <></>
            )}
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            id="submit"
            className="btn1"
          >
            Start Betting
          </button>
        </div>
      )}
    </>
  );
};

export default Poolsettings;
