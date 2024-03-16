import React, { useState, useEffect } from "react";
import Countdown from "./Countdown";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

function Dashboard() {
  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h4>Time Until Next Match</h4>
      <Countdown />
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <h4>Price History</h4>
    </Paper>
  );
}

export default Dashboard;
