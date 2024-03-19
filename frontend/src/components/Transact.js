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
  Slider,
  Input,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

function Transact() {
  const [bidData, setBidData] = useState({
    Price: 250,
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
        <Typography id="input-slider" gutterBottom>
          {transType === "buy"
            ? "Maximum Price to Buy 500 Meal Points"
            : "Minimum Price to Sell 500 Meal Points"}
        </Typography>
        <Slider
          aria-labelledby="input-slider"
          id="Price"
          name="Price"
          value={bidData.Price}
          onChange={update}
          min={1}
          max={500}
          valueLabelDisplay="on"
          marks={[
            { value: 1, label: "$1" },
            { value: 100, label: "$100" },
            { value: 200, label: "$200" },
            { value: 300, label: "$300" },
            { value: 400, label: "$400" },
            { value: 500, label: "$500" },
          ]}
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
          Increasing the range of accepted prices will increase your chances of
          being matched with another student.
        </span>
      </Typography>
    </Paper>
  );
}

export default Transact;
