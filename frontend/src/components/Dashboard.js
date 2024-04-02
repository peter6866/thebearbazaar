import React, { useState, useEffect, useCallback } from "react";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import MarketInfo from "./MarketInfo";
import { Paper, Typography, List, ListItem, Divider } from "@mui/material";
import { useConfig } from "../context/ConfigContext";

function Dashboard() {
  const config = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);
  const [matchTime, setMatchTime] = useState();
  const [marketInfo, setMarketInfo] = useState({
    numBuyers: "",
    numSellers: "",
    buyPrice: 0,
    sellPrice: 0,
  });

  const loadPriceHistory = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
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
      }
    } catch (error) {}
  }, [config]);

  const loadMatchTime = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/settings/get-scheduled-match-time`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setMatchTime(data.matchTime);
      }
    } catch (error) {}
  }, [config]);

  const loadMarketInfo = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/get-market-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setMarketInfo(data.info);
      }
    } catch (error) {}
  }, [config]);

  useEffect(() => {
    loadPriceHistory();
    loadMatchTime();
    loadMarketInfo();
  }, [loadPriceHistory, loadMatchTime, loadMarketInfo]);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h2> Welcome to The Bear Bazaar! </h2>

      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h3>Active Market Information for 500 Meal Points</h3>
      <MarketInfo info={marketInfo} />
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h3 style={{ marginBottom: "3rem" }}>
        Countdown to Next Buyer/Seller Matching
      </h3>
      <Countdown target={matchTime} />
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h3>Price History</h3>
      <PriceHistory history={priceHistory} />
    </Paper>
  );
}

export default Dashboard;
