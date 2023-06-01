import "./BettingGrid.css";
import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import InputModal from "./InputModal";
import contractContext from "../context/contractContext";
import { useContext } from "react";
import moment from "moment";
import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Aos from "aos";
import "aos/dist/aos.css";

const override = (CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
});
const BettingGrid = (props) => {
  var today = new Date();
  var yesterday = new Date(today);

  yesterday.setDate(today.getDate() + 1);

  today = moment(today).format("MM/DD/YYYY");
  yesterday = moment(yesterday).format("MM/DD/YYYY");
  const [checkedTeam1, setCheckedTeam1] = React.useState(true);
  const [checkedTeam2, setCheckedTeam2] = React.useState(false);

  const handleChangeTeam1 = (event) => {
    setCheckedTeam1(event.target.checked);
    setCheckedTeam2(!event.target.checked);
  };

  const handleChangeTeam2 = (event) => {
    setCheckedTeam2(event.target.checked);
    setCheckedTeam1(!event.target.checked);
  };

  const gridStyle = {
    marginBottom: 2,
    marginTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
    color: "#050505",
  };

  const divStyle = {
    fontFamily: "Orbitron",
    fontWeight: 800,
  };

  const { Contract, Account, data, currency, poolAmount, setDoRefresh } =
    useContext(contractContext);

  const [choices, setChoices] = useState([]);

  const [LeftChoicess, setLeftChoicess] = useState([]);
  const [RightChoicess, setRightChoicess] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let UserChoices = [
    {
      MatchID: 1200,
      Choice: "NICKFURY",
    },
  ];

  let UserLeftChoices = [
    {
      MatchID: 1200,
      Choice: "NICKFURY",
    },
  ];
  let UserRightChoices = [
    {
      MatchID: 1200,
      Choice: "NICKFURY",
    },
  ];

  let LastWeekResults = [
    {
      MatchID: 1200,
      WinningTeamID: 21,
    },
  ];

  var PlacedAmount;

  useEffect(() => {
    document.title = "Sports Betting | NFL";
    Aos.init({ duration: 1500 });
  }, []);

  const getChoices = async () => {
    try {
      setIsLoading(true);
      for (let i = 0; i < 1387; i++) {
        if (
          moment(data[i].date.start).utc().format("MM/DD/YYYY") === yesterday ||
          moment(data[i].date.start).utc().format("MM/DD/YYYY") === today
        ) {
          const kli = await Contract.methods
            .getMatch(data[i].id)
            .call({ from: Account[0] });
          if (kli.amount === "0") {
            // console.log(data[i]);
          } else {
            let leftChoiceTemp = {
              MatchID: data[i].id,
              User1Addr: kli.User1Addr,
              User1Choice: kli.User1Choice,
              Amount: kli.amount,
            };
            let rightChoiceTemp = {
              MatchID: data[i].id,
              User2Addr: kli.User2Addr,
              User2Choice: kli.User2Choice,
              Amount: kli.amount,
            };
            // console.log(leftChoiceTemp, rightChoiceTemp);
            let choese = {
              MatchID: data[i].id,
              User1Addr: kli.User1Addr,
              User1Choice: kli.User1Choice,
              User2Addr: kli.User2Addr,
              User2Choice: kli.User2Choice,
              Amount: kli.amount,
            };
            // console.log(choese);
            UserLeftChoices.push(leftChoiceTemp);
            UserRightChoices.push(rightChoiceTemp);
            // testing();
            UserChoices.push(choese);
          }
        }
      }
      setLeftChoicess(UserLeftChoices);
      setChoices(UserChoices);
      setRightChoicess(UserRightChoices);
    } finally {
      setIsLoading(false);
    }
    return UserChoices;
  };

  const getExistChoiceLeftSide = (ID) => {
    let data = LeftChoicess.filter((choice) => choice.MatchID === ID);
    let data2 = RightChoicess.filter((choice) => choice.MatchID === ID);
    if (Object.keys(data).length === 0) {
      return false;
    } else {
      if (data2[0].User2Addr === Account[0]) {
        return true;
      }
      if (data[0].User1Addr === "0x0000000000000000000000000000000000000000") {
        return false;
      } else {
        return true;
      }
    }
  };

  const getExistChoiceRightSide = (ID) => {
    let data = RightChoicess.filter((choice) => choice.MatchID === ID);

    let data2 = LeftChoicess.filter((choice) => choice.MatchID === ID);

    if (Object.keys(data).length === 0) {
      return false;
    } else {
      if (data2[0].User1Addr === Account[0]) {
        return true;
      }
      if (data[0].User2Addr === "0x0000000000000000000000000000000000000000") {
        return false;
      } else {
        return true;
      }
    }
  };

  const getLeftMatchBettedAAmount = (MatchID) => {
    let data = LeftChoicess.filter((choice) => choice.MatchID === MatchID);
    return data[0].Amount;
  };

  const getRightMatchBettedAAmount = (MatchID) => {
    let data = RightChoicess.filter((choice) => choice.MatchID === MatchID);

    return data[0].Amount;
  };

  const placedRight = (MatchID) => {
    let data1 = RightChoicess.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data1).length === 0) {
      return false;
    } else {
      if (data1[0].User2Addr === Account[0]) {
        return true;
      } else {
        return false;
      }
    }
  };
  const placedLeft = (MatchID) => {
    // console.log(UserLeftChoices);
    let data1 = LeftChoicess.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data1).length === 0) {
      return false;
    } else {
      if (data1[0].User1Addr === Account[0]) {
        return true;
      } else {
        return false;
      }
    }
  };

  const betPlacedLeft = (MatchID, long) => {
    if (long === "Scheduled") {
      let data1 = LeftChoicess.filter((choice) => choice.MatchID === MatchID);
      console.log(data1);
      if (Object.keys(data1).length === 0) {
        return true;
      } else {
        if (data1[0].User1Addr === Account[0]) {
          return false;
        } else if (data1[0].User1Choice === "0") {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };

  const betPlacedRight = (MatchID, long) => {
    // console.log(UserLeftChoices);
    if (long === "Scheduled") {
      let data1 = RightChoicess.filter((choice) => choice.MatchID === MatchID);
      console.log(data1);
      if (Object.keys(data1).length === 0) {
        return true;
      } else {
        if (data1[0].User2Addr === Account[0]) {
          return false;
        } else if (data1[0].User2Choice === "0") {
          return true;
        } else {
          console.log("first");
          return false;
        }
      }
    } else {
      console.log("this mis false", long);
      return false;
    }
  };

  const getBettedTeamLeft = (
    ID,
    HomeScore,
    VisitorsScore,
    HomeNick,
    VisitorNick
  ) => {
    let data123 = LeftChoicess.filter((choice) => choice.MatchID === ID);
    // console.log(data123);
    if (HomeScore > VisitorsScore && data123[0].User1Choice === HomeNick) {
      return 1;
    } else if (
      VisitorsScore > HomeScore &&
      data123[0].User1Choice === VisitorNick
    ) {
      return 2;
    } else {
      return -1;
    }
  };

  const getBettedTeamRight = (
    ID,
    HomeScore,
    VisitorsScore,
    HomeNick,
    VisitorNick
  ) => {
    let data123 = RightChoicess.filter((choice) => choice.MatchID === ID);
    // console.log(data123);
    if (HomeScore > VisitorsScore && data123[0].User2Choice === HomeNick) {
      return 1;
    } else if (
      VisitorsScore > HomeScore &&
      data123[0].User2Choice === VisitorNick
    ) {
      return 2;
    } else {
      return -1;
    }
  };

  const onPlace = (MatchID, Choice, where) => {
    setIsLoading(true);
    // console.log(PlacedAmount);

    let data = choices.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data).length === 0) {
    } else {
      PlacedAmount = parseInt(data[0].Amount);
    }
    if (where === 1) {
      Contract.methods
        .AddMatchLeft(MatchID, Choice, parseInt(PlacedAmount))
        .send({ from: Account[0] })
        .on("confirmation", (reciept) => {
          console.log("Passed");
          setIsLoading(false);
          window.location.reload();
          // window.location.reload(false);
          // navigate("nfl");
          // navigate(0);
          // location.reload();
          // setDoRefresh(true);
        })
        .on("error", (error, receipt) => {
          console.log("Error receipt: ", error, receipt);
        });
    } else if (where === 2) {
      Contract.methods
        .AddMatchRight(MatchID, Choice, PlacedAmount)
        .send({ from: Account[0] })
        .on("confirmation", (reciept) => {
          setIsLoading(false);
          window.location.reload();
          // window.location.reload(false);
          // navigate("nfl");
          // navigate(0);
          // location.reload();
          // setDoRefresh(true);
        })
        .on("error", (error, receipt) => {
          console.log("Error receipt: ", error, receipt);
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <ClipLoader size={150} cssOverride={override} />
      ) : (
        <div style={divStyle}>
          <Box sx={{ boxShadow: 3 }}>
            <Card
              data-aos="zoom-out"
              style={{
                minWidth: "30%",
                borderRadius: 20,
                marginTop: props.margin ? props.margin : "8%",
                marginRight: "8%",
                marginLeft: "8%",
              }}
            >
              <Grid
                container
                sx={gridStyle}
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                data-aos="fade-up"
              >
                <Grid
                  item
                  xs={2}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Checkbox
                    checked={checkedTeam1}
                    onChange={handleChangeTeam1}
                  />
                </Grid>
                <Grid // constant name and logo
                  item
                  xs={3}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  {props.gridObject.home.name}
                  <Box
                    component="img"
                    sx={{
                      height: 50,
                      width: 50,
                      borderRadius: 100,
                      maxHeight: { xs: 35, md: 167 },
                      maxWidth: { xs: 35, md: 250 },
                    }}
                    alt={props.gridObject.home.name}
                    src={props.gridObject.home.logo}
                  />
                </Grid>
                <Grid // constant
                  item
                  xs={1}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  Vs.
                </Grid>
                <Grid
                  item
                  xs={2}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  {props.gridObject.visitors.name}
                  <Box
                    component="img"
                    sx={{
                      height: 35,
                      width: 35,
                      borderRadius: 100,
                      maxHeight: { xs: 35, md: 167 },
                      maxWidth: { xs: 35, md: 250 },
                    }}
                    alt={props.gridObject.visitors.name}
                    src={props.gridObject.visitors.logo}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Checkbox
                    checked={checkedTeam2}
                    onChange={handleChangeTeam2}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button data-aos="fade-up" color="primary" variant="outlined">
                    <InputModal
                    // setPoolAmount={props.gridObject.setPoolAmount}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </div>
      )}
    </>
  );
};

export default BettingGrid;
