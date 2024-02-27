import React, { useState, useEffect } from "react";
import { Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";

function ViewMatched() {
  const { authToken } = useAuth();
  const config = useConfig();

  const [isMatched, setIsMatched] = useState(false);
  const [matchedType, setMatchedType] = useState("");
  const [matchedEmail, setmatchedEmail] = useState("");
  const [matchedPrice, setMatchedPrice] = useState(0);

  // when click contact seller, redirect to send email
  const contactSeller = () => {
    window.location.href = `mailto:${matchedEmail}`;
  };

  const fetchMatched = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/match-info`,
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
        setIsMatched(true);
        const { matchedType, email, price } = data.data.matchDetails;
        setMatchedType(matchedType);
        setmatchedEmail(email);
        setMatchedPrice(price);
      } else {
        setIsMatched(false);
      }
    } catch (error) {
      setIsMatched(false);
    }
  };

  useEffect(() => {
    fetchMatched();
  }, []);

  return (
    <Paper elevation={3} style={{ padding: "2rem", marginBottom: "20px" }}>
      <h3>Matching Information</h3>
      {isMatched ? (
        <div>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "10px" }}
          >
            A {matchedType === "Seller" ? "seller" : "buyer"} is matched based
            on your bid.
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "10px" }}
          >
            <strong>{matchedType}'s Email:</strong> {matchedEmail}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "20px" }}
          >
            <strong>Matched Price:</strong> ${matchedPrice}
          </Typography>
          <Button variant="contained" fullWidth onClick={contactSeller}>
            Contact Seller
          </Button>
        </div>
      ) : (
        <Typography variant="body1" component="p">
          No matches found yet.
        </Typography>
      )}
    </Paper>
  );
}

export default ViewMatched;
