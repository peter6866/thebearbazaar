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
    <div className="container-outer">
      {hasBid ? (
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography
            variant="h6"
            component="h3"
            style={{ marginBottom: "10px" }}
          >
            Bid Information
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
          <Button variant="contained" fullWidth onClick={cancelBid}>
            Cancel Bid
          </Button>
        </Paper>
      ) : (
        <Typography variant="body1" component="p">
          You have not placed a bid yet.
        </Typography>
      )}
    </div>
  );
}

export default ViewBid;
