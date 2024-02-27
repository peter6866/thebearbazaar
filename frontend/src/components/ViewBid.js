import React, { useState, useEffect } from "react";
import { Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";

function ViewBid() {
  const { authToken } = useAuth();
  const config = useConfig();

  const [bidType, setBidType] = useState("");
  const [bidPrice, setBidPrice] = useState(0);
  const [hasBid, setHasBid] = useState(false);

  const today = new Date();
  const daysUntilNextSunday = 7 - today.getDay();
  const nextSundayTimestamp =
    today.getTime() + daysUntilNextSunday * 24 * 60 * 60 * 1000;
  const nextSunday = new Date(nextSundayTimestamp).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchBid = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/get-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data) {
        setBidType(data.trans);
        setBidPrice(data.price);
        setHasBid(true);
      } else {
        setHasBid(false);
      }
    } catch (error) {
      setHasBid(false);
    }
  };

  const cancelBid = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/cancel-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setHasBid(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchBid();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Bid Information</h3>
      {hasBid ? (
        <div>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "10px" }}
          >
            <strong>Match Date:</strong> {nextSunday}{" "}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "10px" }}
          >
            <strong>Bid Type:</strong> {bidType}{" "}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "20px" }}
          >
            <strong>Bid Price:</strong> ${bidPrice}{" "}
          </Typography>
          <div class="btn-wrapper">
            <Button variant="contained" onClick={cancelBid}>
              Cancel Bid
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Typography variant="body1" component="p">
            You currently have no bids.
          </Typography>
        </div>
      )}
    </Paper>
  );
}

export default ViewBid;
