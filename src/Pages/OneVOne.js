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
import { HiPlusCircle, HiMinusCircle } from "react-icons/hi";
import moment from "moment";
import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Aos from "aos";
import "aos/dist/aos.css";
import "./OneVOne.css";
import { ImCheckboxChecked } from "react-icons/im";
import { GrStakeholder } from "react-icons/gr";
const OneVOne = () => {
  const [checkedTeam1, setCheckedTeam1] = React.useState(false);
  const [checkedTeam2, setCheckedTeam2] = React.useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState();
  // var selectedTeamId;

  const handleChangeTeam1 = (teamID) => {
    setCheckedTeam1(true);
    setCheckedTeam2(false);
    setSelectedTeamId(teamID);
    // selectedTeamId = teamID;
  };

  const handleChangeTeam2 = (teamID) => {
    setCheckedTeam1(false);
    setCheckedTeam2(true);
    setSelectedTeamId(teamID);
    // selectedTeamId = teamID;
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
  const useContractContext = () => useContext(contractContext);

  var today = new Date();
  var yesterday = new Date(today);

  yesterday.setDate(today.getDate() + 1);

  today = moment(today).format("MM/DD/YYYY");
  yesterday = moment(yesterday).format("MM/DD/YYYY");

  const {
    Contract,
    web3,
    Account,
    data,
    tokenContract,
    setCurrency,
    setPoolAmount,
    currency,
    poolAmount,
  } = useContractContext();

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
          } else {
            console.log(data[i]);
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
            console.log(leftChoiceTemp, rightChoiceTemp);
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
      if (data2[0].User2Addr.toLowerCase() === Account[0].toLowerCase()) {
        return true;
      }
      if (
        data[0].User1Addr === "0x0000000000000000000000000000000000000000" ||
        data[0].User1Choice === "0"
      ) {
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
      if (data2[0].User1Addr.toLowerCase() === Account[0].toLowerCase()) {
        return true;
      }
      if (data[0].User2Addr === "0x0000000000000000000000000000000000000000") {
        return false;
      } else {
        return true;
      }
    }
  };

  const checkLeftrightChoice = (ID) => {
    if (getExistChoiceRightSide(ID) || getExistChoiceLeftSide(ID)) {
      return true;
    } else {
      return false;
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
    // did current user placed right?
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
    // // did current user placed left?
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

  const betPlacedLeft = (MatchID) => {
    let data1 = LeftChoicess.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data1).length === 0) {
      return 1;
    } else {
      if (data1[0].User1Addr.toLowerCase() === Account[0].toLowerCase()) {
        return -1;
      } else if (data1[0].User1Choice === "0") {
        return 0;
      } else {
        return 0;
      }
    }
  };

  const betPlacedRight = (MatchID) => {
    let data1 = RightChoicess.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data1).length === 0) {
      return 1;
    } else {
      if (data1[0].User2Addr.toLowerCase() === Account[0].toLowerCase()) {
        return -1;
      } else if (data1[0].User2Choice === "0") {
        return 0;
      } else {
        return 0;
      }
    }
  };

  const notPlaced = (ID) => {
    if (betPlacedLeft(ID) === 1 && betPlacedRight(ID) === 1) {
      return false;
    } else if (betPlacedLeft(ID) === -1 || betPlacedRight(ID) === -1) {
      return false;
    } else if (betPlacedLeft(ID) === 0 || betPlacedRight(ID) === 0) {
      return true;
    }
  };

  const betPlacedLeftByAnyOne = (MatchID) => {
    let data1 = LeftChoicess.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data1).length === 0) {
      return -1;
    } else {
      if (data1[0].User1Addr.toLowerCase() === Account[0].toLowerCase()) {
        return -1;
      } else if (
        data1[0].User1Addr !== "0x0000000000000000000000000000000000000000"
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  const betPlacedRightByAnyOne = (MatchID) => {
    let data1 = RightChoicess.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data1).length === 0) {
      return -1;
    } else {
      if (data1[0].User2Addr.toLowerCase() === Account[0].toLowerCase()) {
        return -1;
      } else if (
        data1[0].User2Addr.toLowerCase() !==
        "0x0000000000000000000000000000000000000000"
      ) {
        return 1;
      } else {
        return 0;
      }
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
    if (
      HomeScore > VisitorsScore &&
      parseInt(data123[0].User1Choice) === HomeNick
    ) {
      return 1;
    } else if (
      VisitorsScore > HomeScore &&
      parseInt(data123[0].User1Choice) === VisitorNick
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
    console.log(HomeScore, VisitorsScore, HomeNick, VisitorNick);
    let data123 = RightChoicess.filter((choice) => choice.MatchID === ID);
    console.log(data123);
    if (
      HomeScore > VisitorsScore &&
      parseInt(data123[0].User2Choice) === parseInt(HomeNick)
    ) {
      return 1;
    } else if (
      VisitorsScore > HomeScore &&
      parseInt(data123[0].User2Choice) === parseInt(VisitorNick)
    ) {
      console.log("first");
      return 2;
    } else {
      return -1;
    }
  };

  useEffect(() => {
    if (
      typeof Account != "undefined" &&
      typeof Contract != "undefined" &&
      data.length === 1387
    ) {
      getChoices();
    } else {
    }
    // getChoices();
    document.title = "Sports Betting | NFL";
    Aos.init({ duration: 1500 });
    // console.log(choices);
  }, [Account, Contract]);

  const handleClick = () => {
    // let data1 = RightChoicess.filter((choice) => choice.MatchID === 11401);
    // let data2 = LeftChoicess.filter((choice) => choice.MatchID === 11401);
    // console.log(data1[0], "right", betPlacedRightByAnyOne(11401));
    // console.log(data2[0], "left", betPlacedLeftByAnyOne(11401));
    // console.log(Contract._address);
    console.log(data);
    // console.log(getExistChoiceLeftSide(11389));
    // console.log(getExistChoiceRightSide(11389));
  };

  return (
    <div>
      <h1 className="header">Welcome to 1v1 Pool</h1>
      {/* <button
        onClick={handleClick}
        style={{
          fontSize: 38,
        }}
      >
        test button
      </button> */}
      {isLoading ||
      typeof Contract === "undefined" ||
      typeof Account === "undefined" ||
      data.length !== 1387 ? (
        <ClipLoader size={150} />
      ) : (
        data
          .filter(
            (match) =>
              moment(match.date.start).utc().format("MM/DD/YYYY") === today ||
              moment(match.date.start).utc().format("MM/DD/YYYY") === yesterday
          )
          .map((match) => (
            <>
              {isLoading ? (
                <ClipLoader size={150} />
              ) : (
                <div style={divStyle}>
                  <Box sx={{ boxShadow: 3 }}>
                    <Card
                      data-aos="zoom-out"
                      style={{
                        minWidth: "30%",
                        borderRadius: 20,
                        marginTop: "8%",
                        marginRight: "8%",
                        marginLeft: "8%",
                        fontSize: 38,
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
                          {match.status.long === "Finished" &&
                          placedLeft(match.id) ? (
                            getBettedTeamLeft(
                              match.id,
                              match.scores.home.points,
                              match.scores.visitors.points,
                              match.teams.home.id,
                              match.teams.visitors.id
                            ) === -1 ? (
                              <HiMinusCircle size={25} color="green" />
                            ) : (
                              <HiPlusCircle size={25} color="green" />
                            )
                          ) : (
                            <></>
                          )}

                          {match.status.long === "Scheduled" ? (
                            getExistChoiceLeftSide(match.id) ? (
                              <></>
                            ) : (
                              <>
                                <Checkbox
                                  style={{ width: "50px", height: "50px" }}
                                  checked={checkedTeam1}
                                  onChange={() => {
                                    handleChangeTeam1(match.teams.home.id);
                                  }}
                                />
                              </>
                            )
                          ) : (
                            <></>
                          )}

                          {betPlacedLeftByAnyOne(match.id) === 1 ? (
                            <>
                              <GrStakeholder size={25} />
                            </>
                          ) : (
                            <></>
                          )}

                          {match.status.long === "Scheduled" &&
                          placedLeft(match.id) ? (
                            <ImCheckboxChecked size={25} />
                          ) : (
                            <></>
                          )}
                        </Grid>
                        <Grid // constant name and logo
                          item
                          xs={3}
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {match.teams.home.nickname}

                          <Box
                            component="img"
                            sx={{
                              height: 50,
                              width: 50,
                              borderRadius: 100,
                              maxHeight: { xs: 35, md: 167 },
                              maxWidth: { xs: 35, md: 250 },
                            }}
                            alt={match.teams.home.nickname}
                            src={match.teams.home.logo}
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
                          {match.teams.visitors.nickname}
                          <Box
                            component="img"
                            sx={{
                              height: 35,
                              width: 35,
                              borderRadius: 100,
                              maxHeight: { xs: 35, md: 167 },
                              maxWidth: { xs: 35, md: 250 },
                            }}
                            alt={match.teams.visitors.nickname}
                            src={match.teams.visitors.logo}
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
                          {match.status.long === "Scheduled" &&
                          placedRight(match.id) ? (
                            <ImCheckboxChecked size={25} />
                          ) : (
                            <></>
                          )}

                          {betPlacedRightByAnyOne(match.id) === 1 ? (
                            <>
                              <GrStakeholder size={25} />
                            </>
                          ) : (
                            <></>
                          )}

                          {match.status.long === "Scheduled" ? (
                            getExistChoiceRightSide(match.id) ? (
                              <></>
                            ) : (
                              <>
                                <Checkbox
                                  style={{ width: "50px", height: "50px" }}
                                  checked={checkedTeam2}
                                  onChange={() => {
                                    handleChangeTeam2(match.teams.visitors.id);
                                  }}
                                />
                              </>
                            )
                          ) : (
                            <></>
                          )}

                          {match.status.long === "Finished" &&
                          placedRight(match.id) ? (
                            getBettedTeamRight(
                              match.id,
                              match.scores.home.points,
                              match.scores.visitors.points,
                              match.teams.home.id,
                              match.teams.visitors.id
                            ) === -1 ? (
                              <HiMinusCircle size={25} color="green" />
                            ) : (
                              <HiPlusCircle size={25} color="green" />
                            )
                          ) : (
                            <></>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {checkLeftrightChoice(match.id) ? (
                            <>{getLeftMatchBettedAAmount(match.id)}</>
                          ) : (
                            <>
                              {match.status.long === "Scheduled" ? (
                                <Button
                                  data-aos="fade-up"
                                  color="primary"
                                  variant="outlined"
                                >
                                  <InputModal
                                    alreadyPlaced={false}
                                    matchID={match.id}
                                    checkedTeam1={checkedTeam1}
                                    checkedTeam2={checkedTeam2}
                                    choices={choices}
                                    match={match.id}
                                    selectedTeamId={selectedTeamId}
                                    RightChoicess={RightChoicess}
                                    LeftChoicess={LeftChoicess}
                                  />
                                </Button>
                              ) : (
                                <></>
                              )}
                            </>
                          )}

                          {notPlaced(match.id) ? (
                            <>
                              <Button
                                data-aos="fade-up"
                                color="primary"
                                variant="outlined"
                              >
                                <InputModal
                                  alreadyPlaced={true}
                                  matchID={match.id}
                                  checkedTeam1={checkedTeam1}
                                  checkedTeam2={checkedTeam2}
                                  choices={choices}
                                  match={match.id}
                                  selectedTeamId={selectedTeamId}
                                  RightChoicess={RightChoicess}
                                  LeftChoicess={LeftChoicess}
                                />
                              </Button>
                            </>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>
                </div>
              )}
            </>
          ))
      )}
    </div>
  );
};

export default OneVOne;
