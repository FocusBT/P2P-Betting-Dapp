import React from "react";
import moment from "moment";
import { useEffect, useState, CSSProperties } from "react";
import "./PublicPools.css";
import { useContext } from "react";
import contractContext from "../context/contractContext";
import { HiPlusCircle, HiMinusCircle } from "react-icons/hi";
import { BiRadioCircleMarked } from "react-icons/bi";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useLocation } from "react-router-dom";
const override = (CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
});
const PublicPools = (route) => {
  const navigate = useNavigate();

  // const history = useHistory();
  const location = useLocation();

  const {
    Contract,
    Account,
    data,
    currency,
    poolAmount,
    setDoRefresh,
    tokenContract,
  } = useContext(contractContext);

  const [choices, setChoices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [LastWeekResult, setLastWeekResult] = useState([]);

  const [betAtOnce, setBetAtOnce] = useState(true);

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

  let LastWeekResults = [
    {
      MatchID: 1200,
      WinningTeamID: 21,
    },
  ];

  let MatchIDs = [];
  let WinningTeamIDs = [];
  // setting current week
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
    console.log("i AM IN");
    // console.log(data);
    try {
      setIsLoading(true);
      for (let i = 0; i < 1387; i++) {
        for (let j = 0; j < days.length; j++) {
          if (
            moment(data[i].date.start).utc().format("MM/DD/YYYY") === days[j]
          ) {
            // console.log(i);
            // console.log(poolAmount, currency, data[i].id);
            const kli = await Contract.methods
              .getChoices(
                location.state.poolAmount,
                location.state.currency,
                data[i].id
              )
              .call({ from: Account[0] });
            // console.log(kli);
            if (kli === "0") {
              // console.log(data[i]);
            } else {
              if (parseInt(kli) === data[i].teams.home.id) {
                let choese = {
                  MatchID: data[i].id,
                  Choice: data[i].teams.home.nickname,
                };
                // console.log(choese);
                UserChoices.push(choese);
              } else if (parseInt(kli) === data[i].teams.visitors.id) {
                let choese123 = {
                  MatchID: data[i].id,
                  Choice: data[i].teams.visitors.nickname,
                };
                // console.log(choese123);
                UserChoices.push(choese123);
              }
            }
            // console.log(i);
          }
        }
      }
      setChoices(UserChoices);
      // console.log(UserChoices);
    } finally {
      setIsLoading(false);
    }
    return UserChoices;
  };

  const getExistChoice = (ID) => {
    let data = choices.filter((choice) => choice.MatchID === ID);
    if (Object.keys(data).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const getBettedTeam = (
    ID,
    HomeScore,
    VisitorsScore,
    HomeNick,
    VisitorNick
  ) => {
    let data123 = choices.filter((choice) => choice.MatchID === ID);

    if (HomeScore > VisitorsScore && data123[0].Choice === HomeNick) {
      return 1;
    } else if (VisitorsScore > HomeScore && data123[0].Choice === VisitorNick) {
      return 2;
    } else {
      return -1;
    }
  };

  const PlacedHereOrNot = (ID, nickName) => {
    let data123 = choices.filter((choice) => choice.MatchID === ID);
    // console.log(data123, nickName);
    if (nickName === data123[0].Choice) {
      // console.log(first)
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    console.log(location.state);
    if (
      typeof Account != "undefined" &&
      typeof Contract != "undefined" &&
      data.length === 1387
    ) {
      console.log("ALL 3 CONDITIONS ARE DONE");
      getChoices();
      getResultsOfLastWeek();
      console.log(UserChoices);
    } else {
    }
    // getChoices();
    // document.title = "Sports Betting | NFL";
    // Aos.init({ duration: 1500 });
    // console.log(choices);
  }, [Account, Contract, data.length]);

  // useEffect(() => {
  //   getChoices();
  //   getResultsOfLastWeek();
  //   console.log(LastWeekResults);
  //   console.log(MatchIDs, WinningTeamIDs);
  // }, [props.id]);

  const onPlace = async () => {
    setIsLoading(true);
    Contract.methods
      .addChoice(
        poolAmount,
        currency,
        SelectedMatchIds.toString().split(","),
        SelectedTeamIds.toString().split(",")
      )
      .send({ from: Account[0] })
      .on("confirmation", (reciept) => {
        setIsLoading(false);
        window.location.reload();
      })
      .on("error", (error, receipt) => {
        console.log("Error receipt: ", error, receipt);
      });
  };

  return (
    <>
      {isLoading ? (
        <ClipLoader size={150} cssOverride={override} />
      ) : (
        <div className="linear">
          <h1 className="header">Welcome to Public Pool</h1>
          {/* <button onClick={() => window.location.reload()}>Refresh Page</button> */}
          <h1 className="week">Current Week Matches</h1>
          <button
            style={{
              fontSize: "2rem",
            }}
            onClick={onPlace}
          >
            Place Bet
          </button>
          {isLoading ||
          typeof Contract === "undefined" ||
          typeof Account === "undefined" ||
          data.length !== 1387 ||
          choices.length === 0 ? (
            <ClipLoader size={150} />
          ) : (
            data
              .filter(
                (match) =>
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[0] ||
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[1] ||
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[2] ||
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[3] ||
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[4] ||
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[5] ||
                  moment(match.date.start).utc().format("MM/DD/YYYY") ===
                    days[6]
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
                        {match.status.long === "Finished" &&
                        getExistChoice(match.id) ? (
                          getBettedTeam(
                            match.id,
                            match.scores.home.points,
                            match.scores.visitors.points,
                            match.teams.home.nickname,
                            match.teams.visitors.nickname
                          ) === -1 ? (
                            <HiMinusCircle color="green" />
                          ) : (
                            <HiPlusCircle color="green" />
                          )
                        ) : (
                          <></>
                        )}

                        {match.status.long === "Scheduled" &&
                        getExistChoice(match.id) ? (
                          PlacedHereOrNot(
                            match.id,
                            match.teams.home.nickname
                          ) ? (
                            <BiRadioCircleMarked />
                          ) : (
                            <></>
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
                      <FormControl>
                        {match.status.long === "Scheduled" ? (
                          getExistChoice(match.id) ? (
                            <>
                              <p className="vs">vs</p>
                            </>
                          ) : (
                            <>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const index = SelectedMatchIds.indexOf(
                                      match.id
                                    );
                                    if (index > -1) {
                                      // only splice array when item is found
                                      SelectedMatchIds.splice(index, 1); // 2nd parameter means remove one item only
                                      SelectedTeamIds.splice(index, 1);
                                    }
                                    addTeam(match.id, e.target.value);
                                  } else {
                                    const index = SelectedMatchIds.indexOf(
                                      match.id
                                    );
                                    if (index > -1) {
                                      // only splice array when item is found
                                      SelectedMatchIds.splice(index, 1); // 2nd parameter means remove one item only
                                      SelectedTeamIds.splice(index, 1);
                                    }
                                  }
                                }}
                              >
                                <FormControlLabel
                                  value={match.teams.home.id}
                                  control={<Radio size="large" />}
                                />

                                <p className="vs">vs</p>

                                <FormControlLabel
                                  value={match.teams.visitors.id}
                                  control={<Radio size="large" />}
                                />
                              </RadioGroup>
                            </>
                          )
                        ) : (
                          <></>
                        )}
                      </FormControl>

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

                        {match.status.long === "Scheduled" &&
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
                        )}

                        {match.status.long === "Finished" &&
                        getExistChoice(match.id) ? (
                          getBettedTeam(
                            match.id,
                            match.scores.home.points,
                            match.scores.visitors.points,
                            match.teams.home.nickname,
                            match.teams.visitors.nickname
                          ) === -1 ? (
                            <HiMinusCircle color="green" />
                          ) : (
                            <HiPlusCircle color="green" />
                          )
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ))
          )}
        </div>
      )}
    </>
  );
};

export default PublicPools;
