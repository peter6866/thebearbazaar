import React from "react";
import { Box, Typography } from "@mui/material";
import {
  IgrCategoryChartModule,
  IgrCategoryChart,
} from "igniteui-react-charts";
import moment from "moment-timezone";

IgrCategoryChartModule.register();

function formatDate(isoString) {
  const date = moment.utc(isoString);
  return date.local().format("MM/DD/YYYY");
}

const PriceHistory = ({ history }) => {
  history = history.map((record) => {
    return {
      Date: formatDate(record.createdAt),
      Price: record.price,
    };
  });

  return (
    <Box className="disable-touch">
      {history.length > 0 ? (
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
          isHorizontalZoomEnabled={false}
          isVerticalZoomEnabled={false}
        />
      ) : (
        <Typography
          variant="body1"
          component="p"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
          }}
        >
          There are no past price records to show
        </Typography>
      )}
    </Box>
  );
};

export default PriceHistory;
