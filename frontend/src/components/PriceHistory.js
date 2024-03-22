import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  IgrCategoryChartModule,
  IgrCategoryChart,
} from "igniteui-react-charts";
IgrCategoryChartModule.register();

const PriceHistory = ({ history }) => {
  return (
    <Box>
      <IgrCategoryChart
        width="100%"
        height="300px"
        dataSource={history}
        xAxisTitle="Date"
        yAxisTitle="Price"
        xAxisLabelLocation="OutsideBottom"
        yAxisLabelLocation="OutsideLeft"
        xAxisOverlap="auto"
        yAxisMinimumValue={0}
        chartType="line"
      />
    </Box>
  );
};

export default PriceHistory;
