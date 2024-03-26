import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import {
  IgrCategoryChartModule,
  IgrCategoryChart,
} from "igniteui-react-charts";

IgrCategoryChartModule.register();

const PriceHistory = ({ history }) => {
  return (
    history.length > 0 && (
      <div>
        <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
        <h4>Meal Point Price History</h4>
        <Box className="disable-touch">
          <IgrCategoryChart
            width="100%"
            height="300px"
            dataSource={history}
            xAxisTitle="Date"
            yAxisTitle="Price of 500 meal points"
            xAxisLabelLocation="OutsideBottom"
            yAxisLabelLocation="OutsideLeft"
            xAxisOverlap="auto"
            yAxisMinimumValue={0}
            chartType="line"
            isHorizontalZoomEnabled="false"
            isVerticalZoomEnabled="false"
          />
        </Box>
      </div>
    )
  );
};

export default PriceHistory;
