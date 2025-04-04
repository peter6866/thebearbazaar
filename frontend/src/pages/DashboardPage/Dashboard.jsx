import React, { useState, useEffect, useCallback } from "react";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import MarketInfo from "./MarketInfo";
import { Divider, Snackbar, Alert, Typography, Paper } from "@mui/material";
import { useConfig } from "../../context/ConfigContext";
import { useSelector } from "react-redux";
import { selectHasBid } from "../../features/bidSlice";
import { selectIsMatched } from "../../features/bidSlice";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

function Dashboard({ useInAuth = false }) {
  const theme = useTheme();
  const { config } = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);
  const [matchTime, setMatchTime] = useState();
  const [marketInfo, setMarketInfo] = useState({
    numBuyers: "",
    numSellers: "",
    buyPrice: 0,
    sellPrice: 0,
  });

  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");

  const hasBid = useSelector(selectHasBid);
  const isMatched = useSelector(selectIsMatched);

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
      const response = await axios.get(
        `${config.REACT_APP_API_URL}/v1/bids/market-info`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        setMarketInfo(response.data.info);
      }
    } catch (error) {
      setInfoSnackbarMessage("Failed to load market information.");
      setInfoSnackbarOpen(true);
    }
  }, [config]);

  useEffect(() => {
    loadPriceHistory();
    loadMatchTime();
    loadMarketInfo();
  }, [loadPriceHistory, loadMatchTime, loadMarketInfo]);

  const handleSnackbarClose = () => {
    setInfoSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        borderRadius: 2,
        border: 1,
        borderColor: theme.palette.mode === "dark" ? "grey.800" : "#e5e7eb",
      }}
    >
      {!useInAuth && (
        <>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: "bold",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              color: "text.primary",
            }}
          >
            Welcome to The Bear Bazaar!
          </Typography>

          <ul className="steps steps-vertical sm:steps-horizontal w-full sm:mt-2">
            <li className="step step-secondary">Place a buy/sell bid</li>
            <li className={`step ${(hasBid || isMatched) && "step-secondary"}`}>
              Wait and get matched
            </li>
            <li className={`step ${!hasBid && isMatched && "step-secondary"}`}>
              Contact and trade
            </li>
          </ul>
          <Divider
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          ></Divider>
        </>
      )}

      <Typography
        variant="h6"
        component="p"
        sx={{
          fontWeight: "bold",
          mt: useInAuth ? "0.75rem" : "1rem",
          mb: useInAuth ? "0rem" : "1rem",
          color: "text.primary",
        }}
      >
        Active Market Information for 500 Meal Points
      </Typography>
      <MarketInfo info={marketInfo} />
      {useInAuth ? (
        <Divider style={{ marginTop: "18px", marginBottom: "1rem" }}></Divider>
      ) : (
        <Divider style={{ marginTop: "2rem", marginBottom: "2rem" }}></Divider>
      )}

      {!useInAuth && (
        <>
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontWeight: "bold",
              marginBottom: "3rem",
              color: "text.primary",
            }}
          >
            Countdown to Next Buyer/Seller Matching
          </Typography>
          <Countdown target={matchTime} />
          <Divider
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          ></Divider>
        </>
      )}

      <Typography
        variant="h6"
        component="p"
        sx={{
          fontWeight: "bold",
          mb: useInAuth ? "0.5rem" : "1.5rem",
          color: "text.primary",
        }}
      >
        Price History for 500 Meal Points
      </Typography>
      <PriceHistory history={priceHistory} useInAuth={useInAuth} />
      <Snackbar
        open={infoSnackbarOpen}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {infoSnackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default Dashboard;
