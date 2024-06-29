import React from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  Slider,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

function Transact({
  sendBid,
  transType,
  setTransType,
  bidData,
  update,
  errorMessage,
}) {
  return (
    <>
      <Typography
        variant="h6"
        component="p"
        fontWeight="bold"
        my={2}
        color="text.primary"
      >
        Buy or Sell 500 Mealpoints
      </Typography>
      <form onSubmit={sendBid}>
        <RadioGroup
          row
          name="Transact"
          value={transType}
          onChange={(e) => setTransType(e.target.value)}
        >
          <FormControlLabel
            value="Buy"
            control={<Radio />}
            label="Buy"
            sx={{ color: "text.primary" }}
          />
          <FormControlLabel
            value="Sell"
            control={<Radio />}
            label="Sell"
            sx={{ color: "text.primary" }}
          />
        </RadioGroup>
        <Typography id="input-slider" gutterBottom color="textPrimary">
          {transType === "Buy"
            ? "Maximum Price to Pay for 500 Meal Points"
            : "Minimum Price to Receive for 500 Meal Points"}
        </Typography>
        {transType === "Buy" && (
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
        )}
        {transType === "Sell" && (
          <Slider
            aria-labelledby="input-slider"
            id="Price"
            name="Price"
            value={bidData.Price}
            onChange={update}
            min={1}
            max={500}
            valueLabelDisplay="on"
            track="inverted"
            marks={[
              { value: 1, label: "$1" },
              { value: 100, label: "$100" },
              { value: 200, label: "$200" },
              { value: 300, label: "$300" },
              { value: 400, label: "$400" },
              { value: 500, label: "$500" },
            ]}
          />
        )}

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
      </form>
      <Typography
        style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}
        sx={{ color: "text.primary" }}
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
    </>
  );
}

export default Transact;
