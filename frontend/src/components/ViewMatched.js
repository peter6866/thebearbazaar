import React from "react";
import { Typography, Paper, Button } from "@mui/material";

function ViewMatched({ matchedEmail, matchedType, matchedPrice }) {
  // when click contact seller, redirect to send email
  const contactSeller = () => {
    window.location.href = `mailto:${matchedEmail}`;
  };

  return (
    <Paper elevation={3} style={{ padding: "2rem", marginBottom: "20px" }}>
      <h3>
        You have been matched with a{" "}
        {matchedType === "Seller" ? "seller" : "buyer"}
      </h3>
      <div>
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
          <strong>Price:</strong> ${matchedPrice}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "10px" }}
        >
          Coordinate a time to meet at the Dining Services Office (in BD) and
          carry out the transaction (M-F, 8:30 AM - 4:30 PM)
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "20px" }}
        >
          <strong>
            Do not pay the other person until at the Dining Services Office!
          </strong>
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
