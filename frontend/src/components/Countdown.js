import React, { useState, useEffect } from "react";
import { CircularProgress, Box, Typography, Paper, Grid } from "@mui/material";

const Countdown = () => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const currentDay = now.getUTCDay();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const currentSecond = now.getUTCSeconds();

    let daysLeft = 7 - currentDay;
    let hoursLeft = 17 - currentHour;
    let minutesLeft = 60 - currentMinute;
    let secondsLeft = 60 - currentSecond;

    if (hoursLeft < 0) {
      daysLeft -= 1;
    }

    if (minutesLeft > 0) {
      hoursLeft -= 1;
    }

    if (secondsLeft > 0) {
      minutesLeft -= 1;
    }

    setHoursRemaining(hoursLeft);
    setDaysRemaining(daysLeft);
    setMinutesRemaining(minutesLeft);
    setSecondsRemaining(secondsLeft);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <CircularProgress
        variant="determinate"
        value={100}
        size={250}
        thickness={2}
        color="inherit"
        style={{ position: "absolute", color: "lightgray" }}
      />
      <CircularProgress
        variant="determinate"
        value={
          ((daysRemaining * 24 * 60 * 60 +
            hoursRemaining * 60 * 60 +
            minutesRemaining * 60 +
            secondsRemaining) /
            (7 * 24 * 60 * 60)) *
          100
        }
        size={250}
        thickness={2}
      />
      <Typography
        variant="h6"
        component="div"
        style={{
          position: "absolute",
        }}
      >
        <div>
          {daysRemaining > 0 && (
            <div>
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
            </div>
          )}
          {hoursRemaining > 0 && (
            <div>
              {hoursRemaining} hour{hoursRemaining !== 1 ? "s" : ""}
            </div>
          )}
          {minutesRemaining > 0 && (
            <div>
              {minutesRemaining} minute{minutesRemaining !== 1 ? "s" : ""}
            </div>
          )}
          {secondsRemaining > 0 && (
            <div>
              {secondsRemaining} second{secondsRemaining !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </Typography>
    </Grid>
  );
};

export default Countdown;
