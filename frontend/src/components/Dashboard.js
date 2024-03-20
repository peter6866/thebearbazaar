import React, { useState, useEffect } from "react";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useConfig } from "../context/ConfigContext";

function Dashboard() {
  const config = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);

  let loadPriceHistory = async () => {
    try {
      if (!config || !config.REACT_APP_API_URL) {
        return;
      }

      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/price-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setPriceHistory(data.matchHistory);
        console.log(data.matchHistory);
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadPriceHistory();
  }, [config.REACT_APP_API_URL]);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h4>Time Until Next Match</h4>
      <Countdown target={61200} />
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h4>Meal Point Price History</h4>
      <PriceHistory history={priceHistory} />
    </Paper>
  );
}

export default Dashboard;
