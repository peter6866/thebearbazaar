import React, { useState, useEffect, useCallback } from "react";
import PriceHistory from "./PriceHistory";
import MarketInfo from "./MarketInfo";
import { Divider, Snackbar, Alert, Typography, Paper } from "@mui/material";
import { useConfig } from "../../context/ConfigContext";
import axios from "axios";

function AuthDashboard() {
  const { config } = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);
  const [marketInfo, setMarketInfo] = useState({
    numBuyers: "",
    numSellers: "",
    buyPrice: 0,
    sellPrice: 0,
  });

  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");

  const loadPriceHistory = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/price-history`,
        {
          method: "GET",
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

  const loadMarketInfo = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await axios.get(
        `${config.REACT_APP_API_URL}/v1/bids/market`,
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
    loadMarketInfo();
  }, [loadPriceHistory, loadMarketInfo]);

  const handleSnackbarClose = () => {
    setInfoSnackbarOpen(false);
  };

  return (
    <>
      <Typography
        variant="h6"
        component="p"
        sx={{
          fontWeight: "bold",
          mt: "0.75rem",
          mb: 2,
          color: "text.primary",
        }}
      >
        Active Market Information
      </Typography>
      <MarketInfo info={marketInfo} />
      <Divider style={{ marginTop: "18px", marginBottom: "1rem" }}></Divider>

      <Typography
        variant="h6"
        component="p"
        sx={{
          fontWeight: "bold",
          mb: 2,
          color: "text.primary",
        }}
      >
        Price History
      </Typography>
      <PriceHistory history={priceHistory} useInAuth={true} />
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
    </>
  );
}

export default AuthDashboard;
