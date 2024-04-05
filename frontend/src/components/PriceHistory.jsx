import React from "react";
import { Box } from "@mui/material";
import {
  IgrCategoryChartModule,
  IgrCategoryChart,
} from "igniteui-react-charts";

IgrCategoryChartModule.register();

const PriceHistory = ({ history }) => {
  return (
    <Box className="disable-touch">
      {history.length > 0 ? (
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
          isHorizontalZoomEnabled={false}
          isVerticalZoomEnabled={false}
        />
      ) : (
        <div>There are no past price records to show</div>
      )}
    </Box>
  );
};

export default PriceHistory;
