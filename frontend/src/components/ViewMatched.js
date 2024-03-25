import React, { useState, useEffect } from "react";
import { Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";

function ViewMatched({matchedEmail,matchedType, matchedPrice}) {  

  // when click contact seller, redirect to send email
  const contactSeller = () => {
    window.location.href = `mailto:${matchedEmail}`;
  };

  return (
    
      
        <Paper elevation={3} style={{ padding: "2rem", marginBottom: "20px" }}>
      <h3>Matching Information</h3>
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
          <div className="btn-wrapper">
            <Button variant="contained" onClick={contactSeller}>
              Contact Seller
            </Button>
          </div>
          </div>
          </Paper>
      
    
  );
}

export default ViewMatched;
