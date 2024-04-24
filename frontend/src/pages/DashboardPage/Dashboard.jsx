import React, { useState, useEffect, useCallback } from "react";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import MarketInfo from "./MarketInfo";
import { Divider } from "@mui/material";
import { useConfig } from "../../context/ConfigContext";

function Dashboard({ useInAuth = false }) {
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
    <>
      {!useInAuth && (
        <>
          <p className="text-2xl font-bold my-4 text-gray-900">
            Welcome to The Bear Bazaar!
          </p>
          <Divider
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          ></Divider>
        </>
      )}

      <p
        className={`text-xl font-bold ${
          useInAuth ? "mt-3" : "my-4"
        } text-gray-900`}
      >
        Active Market Information for 500 Meal Points
      </p>
      <MarketInfo info={marketInfo} />
      {useInAuth ? (
        <Divider style={{ marginTop: "18px", marginBottom: "1rem" }}></Divider>
      ) : (
        <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }}></Divider>
      )}

      {!useInAuth && (
        <>
          <p className="text-xl font-bold mb-12 text-gray-900">
            Countdown to Next Buyer/Seller Matching
          </p>
          <Countdown target={matchTime} />
          <Divider
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          ></Divider>
        </>
      )}

      <p
        className={`text-xl font-bold ${
          useInAuth ? "mb-4" : "mb-8"
        } text-gray-900`}
      >
        Price History for 500 Meal Points
      </p>
      <PriceHistory history={priceHistory} />
    </>
  );
}

export default Dashboard;
