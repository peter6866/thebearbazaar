import React, { useState, useEffect, useCallback } from "react";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import { Paper } from "@mui/material";
import { useConfig } from "../context/ConfigContext";

function Dashboard() {
  const config = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);
  const [matchTime, setMatchTime] = useState();

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

  useEffect(() => {
    loadPriceHistory();
    loadMatchTime();
  }, [loadPriceHistory, loadMatchTime]);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h2> Welcome to The Bear Bazaar! Here's how it works: </h2>
      <ul>
        <li> Submit a bid to buy/sell 500 meal points </li>
        <li>
          {" "}
          Our matching algorithm runs weekly to generate mutually beneficial
          matches
        </li>
        <li>
          {" "}
          If you are matched, we provide a price and the email of the other
          student to carry out the transaction{" "}
        </li>
        <li>
          {" "}
          Coordinate a time to meet at the Dining Services Office (in BD) and
          carry out the transaction (M-F, 8:30-4:30){" "}
        </li>
      </ul>

      <h4> Important Information </h4>
      <ul>
        <li>
          {" "}
          Do not pay the other person until at the Dining Services Office{" "}
        </li>
        <li>
          {" "}
          You can only transfer meal points once per semester (per WashU rules)
        </li>
        <li>
          {" "}
          You cannot transfer meal points if you have an off-campus plan (per
          WashU rules){" "}
        </li>
        <li> Do not submit a bid that you are not willing to fulfill </li>
        <li>
          {" "}
          It is not guaranteed that you will be matched, so submit a competitive
          bid to increase your chances{" "}
        </li>
      </ul>

      <h4>Time Until Next Match</h4>
      <Countdown target={matchTime} />

      <PriceHistory history={priceHistory} />
    </Paper>
  );
}

export default Dashboard;
