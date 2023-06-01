import React from "react";
import "./NBA.css";
import WeeklyPicks from "./WeeklyPicks";
import { useState, useEffect } from "react";
import PublicPools from "./PublicPools";
import Poolsettings from "./Poolsettings";
import PrivatePools from "./PrivatePools";
const NBA = () => {
  const [pool, setPool] = useState("");
  const [currency, setCurrency] = useState("");

  useEffect(() => {});

  return <Poolsettings setPool={setPool} setCurrency={setCurrency} />;

  //   return (
  //     <>
  //       <div>
  //         {
  //           pool==="public" ? <PublicPools/> : <Poolsettings setPool={setPool} setCurrency={setCurrency} />
  //         }
  //       </div>
  //     </>
  // );
};

export default NBA;
