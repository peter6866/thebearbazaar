import React, { useState } from "react";
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
  useTheme,
  alpha,
  Chip,
  Paper,
  IconButton,
  Divider,
  Stack,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import {
  InfoOutlined as InfoIcon,
  Close as CloseIcon,
  FullscreenOutlined as ExpandIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import moment from "moment-timezone";

function formatDate(isoString) {
  const date = moment.utc(isoString);
  return date.local().format("MM/DD/YYYY");
}

const PriceHistory = ({ history, useInAuth }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [view, setView] = useState("chart");

  const theme = useTheme();

  // Format data
  const x = history.map((record) => formatDate(record.createdAt));
  const y = history.map((record) => record.price);

  // Calculate price trends
  const currentPrice = y.length > 0 ? y[y.length - 1] : 0;
  const previousPrice = y.length > 1 ? y[y.length - 2] : currentPrice;
  const priceDifference = currentPrice - previousPrice;
  const isPriceUp = priceDifference > 0;

  // Format history for table
  const formattedHistory = x.map((date, index) => ({
    date,
    price: y[index],
    change: index > 0 ? y[index] - y[index - 1] : 0,
  }));

  // Chart colors
  const chartPrimaryColor = "#BA0C2F";

  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  return (
    <Box>
      {x.length > 0 && (
        <Box>
          <Stack
            direction="row"
            spacing={{ md: 2 }}
            sx={{
              flexWrap: { xs: "wrap", md: "nowrap" },
              mb: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                flex: 1,
                minWidth: { xs: "100%", md: 0 },
                mb: { xs: 2, md: 0 },
                bgcolor: alpha(theme.palette.background.default, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Last Matched Price
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                ${currentPrice}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                flex: 1,
                minWidth: { xs: "45%", md: 0 },
                bgcolor: alpha(theme.palette.background.default, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Change
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: isPriceUp
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isPriceUp ? (
                    <ArrowUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                  ) : (
                    <ArrowDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                  )}
                  ${Math.abs(priceDifference)}
                </Typography>
              </Box>
            </Paper>
          </Stack>

          {!useInAuth && (
            <Box sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={view}
                onChange={handleViewChange}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  },
                }}
              >
                <Tab value="chart" label="Chart View" />
                <Tab value="table" label="Table View" />
              </Tabs>
            </Box>
          )}

          {!useInAuth && view === "chart" && (
            <Box
              sx={{
                position: "relative",
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                p: 2,
              }}
            >
              <LineChart
                xAxis={[
                  {
                    scaleType: "point",
                    data: x.length > 6 ? x.slice(-6) : x,
                    label: "Date",
                    tickLabelStyle: {
                      fontSize: 12,
                      fill: theme.palette.text.secondary,
                    },
                  },
                ]}
                yAxis={[
                  {
                    label: "Price ($)",
                    tickLabelStyle: {
                      fontSize: 12,
                      fill: theme.palette.text.secondary,
                    },
                  },
                ]}
                series={[
                  {
                    data: y.length > 6 ? y.slice(-6) : y,
                    label: "Price",
                    color: chartPrimaryColor,
                    curve: "linear",
                  },
                ]}
                margin={{ top: 20, right: 45, bottom: 40, left: 50 }}
                height={300}
                sx={{
                  ".MuiChartsAxis-label": {
                    fill: theme.palette.text.primary,
                  },
                  "& .MuiChartsAxis-tickLabel tspan": {
                    fontSize: 13,
                    fill: theme.palette.text.secondary,
                  },
                  [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: "translateX(-10px)",
                  },
                }}
                grid={{
                  horizontal: true,
                  vertical: false,
                  stroke: alpha(theme.palette.divider, 0.5),
                }}
                slotProps={{ legend: { hidden: true } }}
                bottomAxis={{
                  labelStyle: {
                    fontSize: 15,
                    fill: theme.palette.text.primary,
                  },
                }}
                leftAxis={{
                  labelStyle: {
                    fontSize: 15,
                    fill: theme.palette.text.primary,
                  },
                }}
              />

              <IconButton
                onClick={() => setOpenDialog(true)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: theme.palette.text.secondary,
                }}
              >
                <ExpandIcon />
              </IconButton>
            </Box>
          )}

          {!useInAuth && view === "table" && (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: "hidden",
                maxHeight: 300,
              }}
            >
              <Table stickyHeader aria-label="price history table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                      Date
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                    >
                      Change
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formattedHistory.reverse().map((row, index) => (
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
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            row.change === 0
                              ? theme.palette.text.primary
                              : row.change > 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          fontWeight: 600,
                        }}
                      >
                        {row.change === 0
                          ? "—"
                          : row.change > 0
                          ? `+$${row.change}`
                          : `-$${Math.abs(row.change)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!useInAuth && view === "chart" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing latest {Math.min(6, x.length)} prices
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => setOpenDialog(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View Full Price History
              </Button>
            </Box>
          )}

          {useInAuth && view === "chart" && (
            <Box
              sx={{
                display: "flex",
                mt: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                * Log in to view full price history
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {x.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
          }}
        >
          <InfoIcon
            sx={{
              fontSize: 40,
              color: theme.palette.info.main,
              opacity: 0.7,
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
              textAlign: "center",
            }}
          >
            No Price Data Available
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            There are no past price records to show. Check back after the next
            matching.
          </Typography>
        </Paper>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Complete Price History
          </Typography>
          <IconButton
            onClick={() => setOpenDialog(false)}
            edge="end"
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <LineChart
              xAxis={[
                {
                  scaleType: "point",
                  data: x,
                  label: "Date",
                  tickLabelStyle: {
                    fontSize: 12,
                    fill: theme.palette.text.secondary,
                  },
                },
              ]}
              yAxis={[
                {
                  label: "Price ($)",
                  tickLabelStyle: {
                    fontSize: 12,
                    fill: theme.palette.text.secondary,
                  },
                },
              ]}
              series={[
                {
                  data: y,
                  label: "Price",
                  color: chartPrimaryColor,
                  curve: "linear",
                  lineWidth: 3,
                },
              ]}
              margin={{ top: 20, right: 35, bottom: 40, left: 60 }}
              height={350}
              sx={{
                ".MuiChartsAxis-label": {
                  fill: theme.palette.text.primary,
                },
                "& .MuiChartsAxis-tickLabel tspan": {
                  fontSize: 13,
                  fill: theme.palette.text.secondary,
                },
                [`.${axisClasses.left} .${axisClasses.label}`]: {
                  transform: "translateX(-15px)",
                },
              }}
              grid={{
                horizontal: true,
                vertical: false,
                stroke: alpha(theme.palette.divider, 0.5),
              }}
              slotProps={{ legend: { hidden: true } }}
              bottomAxis={{
                labelStyle: {
                  fontSize: 15,
                  fill: theme.palette.text.primary,
                },
              }}
              leftAxis={{
                labelStyle: {
                  fontSize: 15,
                  fill: theme.palette.text.primary,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Detailed Price Data
          </Typography>

          <TableContainer
            sx={{
              maxHeight: 300,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 2,
            }}
          >
            <Table stickyHeader aria-label="price history table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    Date
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                  >
                    Change
                  </TableCell>
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
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          row.change === 0
                            ? theme.palette.text.primary
                            : row.change > 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    >
                      {row.change === 0
                        ? "—"
                        : row.change > 0
                        ? `+$${row.change}`
                        : `-$${Math.abs(row.change)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              py: 1,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PriceHistory;
