import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material";
import moment from "moment-timezone";
import { LineChart } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

function formatDate(isoString) {
  const date = moment.utc(isoString);
  return date.local().format("MM/DD/YYYY");
}

const PriceHistory = ({ history, useInAuth }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const x = history.map((record) => formatDate(record.Date));
  const y = history.map((record) => record.price);

  const formattedHistory = x.map((date, index) => ({
    date,
    price: y[index],
  }));

  const theme = useTheme();
  return (
    <Box>
      {x.length > 0 ? (
        <>
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: x.length > 6 ? x.slice(-6) : x,
                label: "Date",
              },
            ]}
            yAxis={[
              {
                label: "Price",
              },
            ]}
            series={[
              {
                data: y.length > 6 ? y.slice(-6) : y,
                label: "Price",
                color: "#a51417",
                curve: "linear",
              },
            ]}
            margin={{ top: 8, right: 45, bottom: 40, left: 50 }}
            height={300}
            sx={{
              "& .MuiChartsAxis-tickLabel tspan": { fontSize: 13 },
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: "translateX(-10px)",
              },
            }}
            grid={{ horizontal: true }}
            slotProps={{ legend: { hidden: true } }}
            bottomAxis={{
              labelStyle: {
                fontSize: 15,
              },
            }}
            leftAxis={{
              labelStyle: {
                fontSize: 15,
              },
            }}
          />
          {!useInAuth && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              mx={1}
            >
              <Typography variant="body2" color="text.secondary">
                Showing latest {Math.min(6, x.length)} prices
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => setOpenDialog(true)}
                sx={{
                  width: { xs: "130px", sm: "auto" },
                  minHeight: "auto",
                }}
              >
                View Full Price History
              </Button>
            </Box>
          )}
        </>
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
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Price Histories</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table aria-label="price history table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formattedHistory.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:nth-of-type(odd)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.date}
                    </TableCell>
                    <TableCell align="right">${row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PriceHistory;
