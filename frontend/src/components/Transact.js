import React, { useState } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import Logout from "./Logout";

function Transact() {
  const [bidData, setBidData] = useState({
    Price: 0,
  });

  const [transType, setTransType] = useState("buy");
  const [errorMessage, setErrorMessage] = useState("");
  const config = useConfig();
  const { authToken } = useAuth();
  let update = (e) => {
    const { name, value } = e.target;
    setBidData({ ...bidData, [name]: value });
  };

  let sendBid = async (e) => {
    e.preventDefault();
    //alert(bid);
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
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {}
  };

  return (
    <div className="container-outer">
      <div>
        <Logout />
        <form>
          <FormControl component="fieldset" fullWidth margin="normal">
            Would you like to buy or sell mealpoints?
            <br />
            <RadioGroup
              row
              name="Transact"
              value={transType}
              onChange={(e) => setTransType(e.target.value)}
            >
              <FormControlLabel
                value="buy"
                control={<Radio required />}
                label="Buy"
              />
              <FormControlLabel
                value="sell"
                control={<Radio required />}
                label="Sell"
              />
            </RadioGroup>
            <TextField
              id="Price"
              name="Price"
              label="Willingness to pay: $"
              type="number"
              value={bidData.Price}
              onChange={update}
              InputProps={{ inputProps: { min: 0, max: 500 } }}
              required
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              margin="normal"
              fullWidth
              onClick={sendBid}
            >
              Submit
            </Button>
          </FormControl>
          {errorMessage && (
            <div>
              <Alert severity="error">{errorMessage}</Alert>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Transact;
