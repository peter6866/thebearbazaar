import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Dashboard from "./Dashboard";
import BidPage from "./BidPage";
import Faq from "./Faq";
import AdminPage from "./AdminPage";
import Profile from "./Profile";
import Paper from "@mui/material/Paper";

function HomePage() {
  const { isLoggedIn, logout, isLoading, role } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const navigate = useNavigate();

  const changeTab = (e, tab) => {
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
        <Tabs
          value={selectedTab}
          onChange={changeTab}
          aria-label="mui tab bar"
          variant="scrollable"
          fullWidth
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="My Bid" value="bidpage" />
          <Tab label="FAQ" value="faq" />
          {role === "admin" && <Tab label="Admin" value="admin" />}
          <Box sx={{ flexGrow: 1 }} />
          <Tab value="profile" label="Profile" />
          <Tab label="Logout" value="logout" onClick={logout} />
        </Tabs>
        <Box>
          <div className="container-main">
            <Paper elevation={3} className="p-8">
              {selectedTab === "dashboard" && <Dashboard />}
              {selectedTab === "bidpage" && <BidPage />}
              {selectedTab === "faq" && <Faq />}
              {selectedTab === "admin" && <AdminPage />}
              {selectedTab === "profile" && <Profile />}
            </Paper>
          </div>
        </Box>
      </Box>
    )
  );
}

export default HomePage;
