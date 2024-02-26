// TODO: Create a home page for the Bear Bazaar
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Transact from "./Transact";
import Faq from "./Faq";

function HomePage() {
  const { isLoggedIn, logout, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("transact");
  let navigate = useNavigate();

  let changeTab = (e, tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, isLoading, navigate]);

  return (
    !isLoading &&
    isLoggedIn && (
      <Box sx={{ width: "100%" }}>
        <Tabs value={selectedTab} onChange={changeTab} aria-label="mui tab bar">
          <Tab label="Transact" value="transact" />
          <Tab label="FAQ" value="faq" />
          <Tab label="Logout" value="logout" onClick={logout} />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {selectedTab === "transact" && <Transact />}
          {selectedTab === "faq" && <Faq />}
        </Box>
      </Box>
    )
  );
}

export default HomePage;
