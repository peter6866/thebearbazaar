import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

const PriceHistory = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 7, 2, 4, 6]}
          height={100}
        />
      </Box>
    </>
  );
};

export default PriceHistory;
