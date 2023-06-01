// App.js
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from "./Navbar";
import PublicPools from "./Pages/PublicPools";
import NBA from "./Pages/NBA";
import ContractState from "./context/ContractState";
import OneVOne from "./Pages/OneVOne";
function App() {
  return (
    <div>
      <ContractState>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route forceRefresh={true} path="nfl" element={<NBA />} />
          <Route path="public" element={<PublicPools />} />
          <Route path="OneVOne" element={<OneVOne />} />
        </Routes>
      </ContractState>
    </div>
  );
}

export default App;
