import React from "react";
import moment from "moment";
import { useEffect, useState, CSSProperties } from "react";
import "./PublicPools.css";
import { useContext } from "react";
import contractContext from "../context/contractContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { BiRadioCircleMarked } from "react-icons/bi";
import { HiPlusCircle, HiMinusCircle } from "react-icons/hi";
import { IoIosCheckmark, IoIosCheckmarkCircle } from "react-icons/io";
import { CgCross } from "react-icons/cg";
const override = (CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
});
const OneVOne = (props) => {
  const navigate = useNavigate();

  // const history = useHistory();

  const { Contract, Account, data, currency, poolAmount, setDoRefresh } =
    useContext(contractContext);

  const [choices, setChoices] = useState([]);

  const [LeftChoicess, setLeftChoicess] = useState([]);
  const [RightChoicess, setRightChoicess] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [LastWeekResult, setLastWeekResult] = useState([]);

  var SelectedMatchIds = new Array();
  var SelectedTeamIds = new Array();

  const addTeam = (MID, TID) => {
    SelectedMatchIds.push(MID);
    SelectedTeamIds.push(TID);
  };

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

  let MatchIDs = [];
  let WinningTeamIDs = [];
  // setting current week

  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() + 1);

  today = moment(today).format("MM/DD/YYYY");
  yesterday = moment(yesterday).format("MM/DD/YYYY");
  // console.log(today);
  const days = [];
  const PrevWeekDays = [];

  const curr = new Date();

  days[0] = curr.getDate() - curr.getDay(); // for current week
  PrevWeekDays[0] = curr.getDate() - curr.getDay() - 7; //  for last week to find results

  days[6] = days[0] + 6;
  PrevWeekDays[6] = PrevWeekDays[0] + 6;

  PrevWeekDays[0] = new Date(curr.setDate(PrevWeekDays[0]));
  PrevWeekDays[6] = new Date(curr.setDate(PrevWeekDays[6]));

  days[0] = new Date(curr.setDate(days[0]));
  days[6] = new Date(curr.setDate(days[6]));

  for (let i = 1; i < 7; i++) {
    days[i] = new Date();
    days[i].setDate(days[i - 1].getDate() + 1);
    days[i - 1] = moment(days[i - 1]).format("MM/DD/YYYY");

    PrevWeekDays[i] = new Date();
    PrevWeekDays[i].setDate(PrevWeekDays[i - 1].getDate() + 1);
    PrevWeekDays[i - 1] = moment(PrevWeekDays[i - 1]).format("MM/DD/YYYY");
  }
  days[6] = moment(days[6]).format("MM/DD/YYYY");
  PrevWeekDays[6] = moment(PrevWeekDays[6]).format("MM/DD/YYYY");

  const getResultsOfLastWeek = () => {
    for (let i = 0; i < 1387; i++) {
      for (let j = 0; j < PrevWeekDays.length; j++) {
        if (
          moment(data[i].date.start).utc().format("MM/DD/YYYY") ===
          PrevWeekDays[j]
        ) {
          // LastWeekResults
          if (data[i].scores.home.points > data[i].scores.visitors.points) {
            let temp = {
              MatchID: data[i].id,
              WinningTeamID: data[i].teams.home.id,
            };
            MatchIDs.push(data[i].id);
            WinningTeamIDs.push(data[i].teams.home.id);
            LastWeekResults.push(temp);
          } else if (
            data[i].scores.home.points < data[i].scores.visitors.points
          ) {
            let temp = {
              MatchID: data[i].id,
              WinningTeamID: data[i].teams.visitors.id,
            };
            MatchIDs.push(data[i].id);
            WinningTeamIDs.push(data[i].teams.visitors.id);
            LastWeekResults.push(temp);
          } else {
            // add some to logic to add one point for draw
          }
        }
      }
    }
    setLastWeekResult(LastWeekResults);
  };

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

  const notPlaced = (ID) => {
    let data = RightChoicess.filter((choice) => choice.MatchID === ID);
    let data2 = LeftChoicess.filter((choice) => choice.MatchID === ID);

    if (
      data[0].User2Addr === "0x0000000000000000000000000000000000000000" &&
      data2[0].User1Addr === "0x0000000000000000000000000000000000000000"
    ) {
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
    if (long === "Scheduled") {
      let data1 = RightChoicess.filter((choice) => choice.MatchID === MatchID);
      if (Object.keys(data1).length === 0) {
        return true;
      } else {
        if (data1[0].User2Addr === Account[0]) {
          return false;
        } else if (data1[0].User2Choice === "0") {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };

  const placedOrNot = (MatchID) => {
    let data1 = UserLeftChoices.filter((choice) => choice.MatchID === MatchID);
    let data2 = UserRightChoices.filter((choice) => choice.MatchID === MatchID);

    if (Object.keys(data).length === 0) {
      return false;
    } else {
      return data[0].Amount;
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

  const PlacedHereOrNot = (ID, nickName) => {
    let data123 = choices.filter((choice) => choice.MatchID === ID);

    if (nickName === data123[0].Choice) {
      // console.log(first)
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getChoices();
    // console.log(getExistChoiceLeftSide("11297"));
    // getResultsOfLastWeek();
    // console.log(LastWeekResults);
    // console.log(MatchIDs, WinningTeamIDs);
  }, [props.id]);

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
          // window.location.reload();
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
          // window.location.reload();
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

  const getThisChoice = async (MatchID) => {
    const kli = await Contract.methods
      .getMatchAmount(MatchID)
      .call({ from: Account[0] });
    if (parseInt(kli) === 0) {
      // console.log("/");
      return false;
    } else {
      // console.log("?");
      return true;
    }
  };
  var PlacedAmount;

  const getAmount = async (MatchID) => {
    const kli = await Contract.methods
      .getMatchAmount(MatchID)
      .call({ from: Account[0] });
    return parseInt(kli);
  };

  const setOldAmount = (MatchID) => {
    let data = choices.filter((choice) => choice.MatchID === MatchID);
    if (Object.keys(data).length === 0) {
    } else {
      PlacedAmount = parseInt(data[0].Amount);
    }
  };

  const testing = () => {
    // console.log(RightChoicess);
    // console.log(getExistChoiceRightSide(11297));

    // console.log(placedLeft(11305));
    // console.log(placedRight(11305));
    // console.log("gap");
    // console.log(betPlacedLeft(11305));
    console.log(betPlacedRight(11308, "Scheduled"));
  };

  return (
    <>
      {isLoading ? (
        <ClipLoader size={150} cssOverride={override} />
      ) : (
        <div className="linear">
          <h1 className="header">Welcome to 1 v 1 Pools</h1>
          <button onClick={testing}>Refresh Page</button>
          <h1 className="week">Current Available Matches</h1>
          {/* <button onClick={onPlace}>click me</button> */}
          {data
            .filter(
              (match) =>
                moment(match.date.start).utc().format("MM/DD/YYYY") === today ||
                moment(match.date.start).utc().format("MM/DD/YYYY") ===
                  yesterday
            )
            .map((match) => (
              <>
                <div className="main">
                  <div className="date">
                    <h3 className="date">
                      {moment(match.date.start).utc().format("MM/DD/YYYY")}
                    </h3>
                  </div>

                  <div className="teams">
                    <div className="team1">
                      {match.status.long === "Scheduled" &&
                      placedLeft(match.id) ? (
                        <IoIosCheckmarkCircle />
                      ) : (
                        <></>
                      )}

                      {betPlacedLeft(match.id, match.status.long) ? (
                        <>
                          <CgCross />
                        </>
                      ) : (
                        <></>
                      )}

                      {match.status.long === "Scheduled" ? (
                        getExistChoiceLeftSide(match.id) ? (
                          <>{getLeftMatchBettedAAmount(match.id)}</>
                        ) : (
                          <>
                            <input
                              value="Place"
                              type="submit"
                              className="btnn"
                              onClick={() =>
                                onPlace(match.id, match.teams.home.id, 1)
                              }
                            />
                            <input
                              className="textinput"
                              type="number"
                              onChange={(e) => {
                                PlacedAmount = e.target.value;
                              }}
                            />
                          </>
                        )
                      ) : (
                        <></>
                      )}

                      {match.status.long === "Finished" &&
                      placedLeft(match.id) ? (
                        getBettedTeamLeft(
                          match.id,
                          match.scores.home.points,
                          match.scores.visitors.points,
                          match.teams.home.id,
                          match.teams.visitors.id
                        ) === -1 ? (
                          <HiMinusCircle color="green" />
                        ) : (
                          <HiPlusCircle color="green" />
                        )
                      ) : (
                        <></>
                      )}

                      {match.status.long === "Finished" ? (
                        match.scores.home.points >
                        match.scores.visitors.points ? (
                          <p className="won">Won</p>
                        ) : (
                          <p className="lost">Lost</p>
                        )
                      ) : (
                        <></>
                      )}

                      <p className="teamName">{match.teams.home.nickname}</p>
                      <img
                        className="logo"
                        alt="team1"
                        src={match.teams.home.logo}
                      />
                    </div>
                    <p className="vs">vs</p>

                    <div className="team2">
                      <img
                        className="logo"
                        alt="team2"
                        src={match.teams.visitors.logo}
                      />
                      <p className="teamName">
                        {match.teams.visitors.nickname}
                      </p>

                      {match.status.long === "Finished" ? (
                        match.scores.visitors.points >
                        match.scores.home.points ? (
                          <p className="won">Won</p>
                        ) : (
                          <p className="lost">Lost</p>
                        )
                      ) : (
                        <></>
                      )}

                      {/* {match.status.long === "Scheduled" &&
                      getExistChoice(match.id) ? (
                        PlacedHereOrNot(
                          match.id,
                          match.teams.visitors.nickname
                        ) ? (
                          <BiRadioCircleMarked />
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )} */}

                      {match.status.long === "Finished" &&
                      placedRight(match.id) ? (
                        getBettedTeamRight(
                          match.id,
                          match.scores.home.points,
                          match.scores.visitors.points,
                          match.teams.home.id,
                          match.teams.visitors.id
                        ) === -1 ? (
                          <HiMinusCircle color="green" />
                        ) : (
                          <HiPlusCircle color="green" />
                        )
                      ) : (
                        <></>
                      )}

                      {match.status.long === "Scheduled" ? (
                        getExistChoiceRightSide(match.id) ? (
                          <>{getRightMatchBettedAAmount(match.id)}</>
                        ) : (
                          <>
                            <input
                              value="Place"
                              type="submit"
                              className="btnn"
                              onClick={() =>
                                onPlace(match.id, match.teams.visitors.id, 2)
                              }
                            />
                            <input
                              className="textinput"
                              type="number"
                              onChange={(e) => {
                                PlacedAmount = e.target.value;
                              }}
                            />
                          </>
                        )
                      ) : (
                        <></>
                      )}

                      {betPlacedRight(match.id, match.status.long) ? (
                        <>
                          <CgCross />
                        </>
                      ) : (
                        <></>
                      )}

                      {match.status.long === "Scheduled" &&
                      placedRight(match.id) ? (
                        <IoIosCheckmarkCircle />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
      )}
    </>
  );
};

export default OneVOne;
