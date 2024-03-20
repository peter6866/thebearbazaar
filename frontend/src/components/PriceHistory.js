import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { Line } from "react-chartjs-2";

const PriceHistory = ({ history }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };
  const prices = history.map((item) => item.price);
  const dates = history.map((item) => formatDate(item.date));
  return <Box></Box>;
};

export default PriceHistory;
