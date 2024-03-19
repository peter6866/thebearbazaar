import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

const PriceHistory = ({ history }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };
  const prices = history.map((item) => item.price);
  const dates = history.map((item) => formatDate(item.matchBidTimeStamp));

  return (
    <Box>
      <SparkLineChart
        data={prices}
        xAxis={{
          data: dates,
        }}
        showTooltip
        height={250}
      />
    </Box>
  );
};

export default PriceHistory;
