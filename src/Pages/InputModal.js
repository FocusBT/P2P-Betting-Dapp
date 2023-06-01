import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import contractContext from "../context/contractContext";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 3,
  py: 2,
};
const InputModal = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = React.useState(0);

  const {
    Contract,
    tokenContract,
    Account,
    data,
    currency,
    poolAmount,
    setDoRefresh,
  } = useContext(contractContext);
  var PlacedAmount;

  const updateAmount = (event) => {
    setAmount(Number(event.target.value));
  };

  const handleSubmit = (_) => {
    console.log(props);

    if (props.checkedTeam1 && !props.checkedTeam2) {
      onPlace(props.matchID, props.selectedTeamId, 1);
    } else if (props.checkedTeam2 && !props.checkedTeam1) {
      onPlace(props.matchID, props.selectedTeamId, 2);
    }
    if (amount <= 0) {
      console.log("Error:  value cannot be less than 1");
      return;
    }
    console.log("Amount set");
    // console.log(choices);
    console.log(props.match);
    props.setPoolAmount(amount);
    handleClose();
  };

  const onPlace = async (MatchID, Choice, where) => {
    setLoading(true);
    console.log(MatchID, Choice, where, amount);
    let data = props.choices.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data).length === 0) {
      PlacedAmount = amount;
    } else {
      PlacedAmount = parseInt(data[0].Amount);
    }
    if (where === 1) {
      await tokenContract.methods
        .approve(Contract._address, 100000000)
        .send({ from: Account[0] })
        .on("confirmation", (reciept) => {});

      Contract.methods
        .AddMatchLeft(MatchID, Choice, parseInt(PlacedAmount))
        .send({ from: Account[0] })
        .on("confirmation", (reciept) => {
          setLoading(false);
          navigate("/nfl");
        })
        .on("error", (error, receipt) => {
          console.log("Error receipt: ", error, receipt);
        });
    } else if (where === 2) {
      await tokenContract.methods
        .approve(Contract._address, 100000000)
        .send({ from: Account[0] })
        .on("confirmation", (reciept) => {});

      Contract.methods
        .AddMatchRight(MatchID, Choice, PlacedAmount)
        .send({ from: Account[0] })
        .on("confirmation", (reciept) => {
          setLoading(false);
          navigate("/nfl");
          window.location.reload();
        })
        .on("error", (error, receipt) => {
          console.log("Error receipt: ", error, receipt);
        });
    }
  };

  return (
    <>
      {loading ? (
        <>
          {" "}
          <ClipLoader size={150} />{" "}
        </>
      ) : (
        <>
          {" "}
          <div>
            {props.alreadyPlaced ? (
              <Button
                variant="outlined"
                sx={{ borderRadius: 5, mx: "25%", my: "8%" }}
                onClick={handleSubmit}
              >
                Bet it
              </Button>
            ) : (
              <>
                <Button onClick={handleOpen}>
                  Amount to Bet
                  <CurrencyExchangeIcon sx={{ marginLeft: 2 }} />
                </Button>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={open}>
                    <Box sx={style}>
                      <Typography
                        id="transition-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                          py: 1,
                          fontSize: "110%",
                          fontWeight: 600,
                          mx: "7%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        ENTER BIDDING AMOUNT
                      </Typography>

                      <TextField
                        required
                        id="filled-basic"
                        label="Amount"
                        variant="filled"
                        sx={{ borderRadius: 5, mx: "5%" }}
                        onChange={updateAmount}
                      />

                      <Button
                        variant="outlined"
                        sx={{ borderRadius: 5, mx: "25%", my: "8%" }}
                        onClick={handleSubmit}
                      >
                        Bet it
                      </Button>
                    </Box>
                  </Fade>
                </Modal>
              </>
            )}
          </div>{" "}
        </>
      )}
    </>
  );
};

export default InputModal;
