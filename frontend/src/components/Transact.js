import React, { useState } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

function Transact() {
  const [bidData, setBidData] = useState({
    Price: 0,
  });

  const [transType, setTransType] = useState("buy");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const config = useConfig();
  const { authToken } = useAuth();
  let update = (e) => {
    const { name, value } = e.target;
    setBidData({ ...bidData, [name]: value });
  };

  let sendBid = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/${transType}-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            price: bidData["Price"],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        setSuccessMessage("");
      } else {
        setSuccessMessage(data.message);
        setErrorMessage("");
      }
    } catch (error) {}
  };

  return (
    <Paper elevation={3} style={{ padding: "2rem", marginBottom: "40px" }}>
      <h3>Buy or Sell 500 Mealpoints</h3>
      <form onSubmit={sendBid}>
        <RadioGroup
          row
          name="Transact"
          value={transType}
          onChange={(e) => setTransType(e.target.value)}
        >
          <FormControlLabel value="buy" control={<Radio />} label="Buy" />
          <FormControlLabel value="sell" control={<Radio />} label="Sell" />
        </RadioGroup>
        <TextField
          id="Price"
          name="Price"
          label={
            transType === "buy"
              ? "Maximum Price to Buy 500 Meal Points"
              : "Minimum Price to Sell 500 Meal Points"
          }
          type="number"
          value={bidData.Price}
          onChange={update}
          margin="normal"
          variant="standard"
          fullWidth
        />
        <div className="btn-wrapper">
          <Button type="submit" variant="contained">
            Place Bid
          </Button>
        </div>
        {errorMessage && (
          <div>
            <Alert severity="error">{errorMessage}</Alert>
          </div>
        )}
        {successMessage && (
          <div>
            <Alert severity="success">{successMessage}</Alert>
          </div>
        )}
      </form>
      <Typography
        style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}
      >
        <InfoIcon
          style={{
            fontSize: 20,
            color: "primary",
            backgroundColor: "transparent",
          }}
        />
        <span style={{ marginLeft: "1rem" }}>
          After submitting a bid to buy or sell meal points, you will be matched
          with another student based on your specified price range to complete
          the transaction.
        </span>
      </Typography>
    </Paper>
  );
}

export default Transact;
