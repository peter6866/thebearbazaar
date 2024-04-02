import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress, Typography, Grid } from "@mui/material";

const Countdown = ({ target }) => {
  const [daysRemaining, setDaysRemaining] = useState("");
  const [hoursRemaining, setHoursRemaining] = useState("");
  const [minutesRemaining, setMinutesRemaining] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const calculateTimeRemaining = useCallback(() => {
    const now = new Date();
    const secondsTimeStamp =
      now.getUTCDay() * 24 * 60 * 60 +
      now.getUTCHours() * 60 * 60 +
      now.getUTCMinutes() * 60 +
      now.getUTCSeconds();

    let secondsUntilTarget = target - secondsTimeStamp;
    if (secondsUntilTarget < 0) {
      secondsUntilTarget = 604800 - secondsTimeStamp + target;
    }

    const targetDate = new Date(
      now.getTime() + secondsUntilTarget * 1000
    ).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    setTargetDate(targetDate);

    setDaysRemaining(Math.floor(secondsUntilTarget / 86400));
    secondsUntilTarget = secondsUntilTarget % 86400;
    setHoursRemaining(Math.floor(secondsUntilTarget / 3600));
    secondsUntilTarget = secondsUntilTarget % 3600;
    setMinutesRemaining(Math.floor(secondsUntilTarget / 60));
    secondsUntilTarget = secondsUntilTarget % 60;
    setSecondsRemaining(secondsUntilTarget);
  }, [target]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  return (
    <div className="vertical-space">
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
          component="div"
          style={{
            position: "absolute",
          }}
        >
          <div>
            <table>
              <tbody>
                {daysRemaining !== "" && (
                  <tr>
                    <td style={{ float: "right" }}>{daysRemaining}</td>
                    <td>day{daysRemaining !== 1 ? "s" : ""}</td>
                  </tr>
                )}
                {hoursRemaining !== "" && (
                  <tr>
                    <td style={{ float: "right" }}>{hoursRemaining}</td>
                    <td>hour{hoursRemaining !== 1 ? "s" : ""}</td>
                  </tr>
                )}
                {minutesRemaining !== "" && (
                  <tr>
                    <td style={{ float: "right" }}>{minutesRemaining}</td>
                    <td>minute{minutesRemaining !== 1 ? "s" : ""}</td>
                  </tr>
                )}
                {secondsRemaining !== "" && (
                  <tr>
                    <td style={{ float: "right" }}>{secondsRemaining}</td>
                    <td>second{secondsRemaining !== 1 ? "s" : ""}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Typography>
      </Grid>
      <div>
        <h4 className="center">{targetDate}</h4>
        <Typography variant="body2" color="textSecondary" align="center">
          At this time, buyers and sellers will be paired together.
        </Typography>
      </div>
    </div>
  );
};

export default Countdown;
