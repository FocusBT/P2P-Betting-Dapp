import React, { useEffect, createContext, useContext, useState } from "react";
import moment from "moment";
import "./Home.css";

const Home = () => {
  const [weight, setWeight] = useState(12);

  return (
    <>
      <div className="container1">
        <div className="pic1">
          <img
            className="imgMobile"
            alt=""
            src={require("../assets/choong-deng-xiang-rVHIqG9tTOE-unsplash.jpg")}
          />
          <img className="img" alt="" src={require("../assets/6204345.jpg")} />
          <div className="text">
            <h1 className="first">Join For Amazing Experience</h1>
            <p className="second">Easy Log In Connect Your Wallet and Play</p>
            <p className="third">Play With Lowest Tax</p>
            <button className="btn" onClick={() => console.log("object")}>
              JOIN NOW
            </button>
          </div>
        </div>

        <div>
          <img
            className="imgMobile"
            src={require("../assets/choong-deng-xiang-sjVcFSYK37E-unsplash.jpg")}
          />
          <img className="img" src={require("../assets/719974.jpg")} />
          <div className="okay">asdasdasasdasd</div>
        </div>
      </div>
      {/* <div className='firstbackground'>

        <div className='event'>
          Join For Amazing Experience
        </div>
        
        <div className='connect'>
          Easy Log In Connect Your Wallet and Play
        </div>

        <div className='gas'>
          Play With Lowest Tax
        </div>
        <button className='btn' onClick={()=>console.log("object")}>JOIN NOW</button>

      </div> */}

      {/* 
      <div className='secondbackground'>
        <div>
        <div className='event'>
          Bet on your Favourite Team
        </div>
        
        <div className='connect'>
          Earn Easy Money
        </div>
        <div className='pool gas'>
          Make your Own Pools
        </div>
        <button className='btn' onClick={()=>console.log("object")}>JOIN NOW</button>
        </div>
      </div>

      <div className='thirdbackground'>
        <div>
        <div className='event'>
          Live P2P Betting Pools
        </div>
        
        <div className='connect'>
          Create Private, Public and 1V1 Pools with Friends
        </div>
        <div className='bet'>
          Wasy Money
        </div>
        <button className='btn' onClick={()=>console.log("object")}>JOIN NOW</button>
        </div>
      </div> */}
    </>
  );
};

export default Home;
