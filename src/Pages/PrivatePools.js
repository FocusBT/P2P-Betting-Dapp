import React, { useState, useEffect } from "react";
import "./PrivatePools.css";
import moment from "moment";
import "rsuite/dist/rsuite.min.css";
import { DatePicker } from "rsuite";
import PublicPools from "./PublicPools";
const PrivatePools = () => {
  const [key, setKey] = useState("");
  const [date, setDate] = useState(new Date());
  const [Match, setMatch] = useState();
  const [MatchDate, setMatchDate] = useState("");
  const [isPrvt, setIsPrvt] = useState(false);

  const handleSubmit = () => {
    console.log("handlesubmit called");
  };

  const getMatches = async (MatchDate) => {
    console.log("asdasdasd");
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "e87e2a9e76msh786bfbc4a06be10p13f47ajsn70ea9376873d",
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
      },
    };

    await fetch(
      `https://api-nba-v1.p.rapidapi.com/games?date=${MatchDate}`,
      options
    )
      .then((response) => response.json())
      .then((response) => setMatch(response))
      .catch((err) => console.error(err));

    console.log(Match);
    setIsPrvt(true);
    setMatchDate(MatchDate);
  };

  return (
    <>
      <h1 className="header">Welcome To Private Pools</h1>
      <div className="join">
        <div className="form-input ">
          <label className="label">Enter Private Pool Key</label>
          <input
            className="inputt"
            name="key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            type="submit"
            id="submit"
            className="btn1"
          >
            JOIN
          </button>
        </div>
      </div>

      <div className="register">
        <div className="form-input ">
          <label className="label">Create Private Pool</label>
          <button
            onClick={handleSubmit}
            type="submit"
            id="submit"
            className="btn1"
          >
            CREATE
          </button>
        </div>
      </div>
    </>
  );
};

export default PrivatePools;
