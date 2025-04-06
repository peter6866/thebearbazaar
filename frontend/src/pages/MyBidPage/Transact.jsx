import React from "react";
import {
  Radio,
  Button,
  Alert,
  Slider,
  Paper,
  Box,
  Typography,
  Divider,
  Stack,
  alpha,
  Fade,
  Card,
  CardContent,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import { useTheme } from "@mui/material/styles";

function Transact({
  sendBid,
  transType,
  setTransType,
  bidData,
  update,
  errorMessage,
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Use primary color for accent
  const accentColor = theme.palette.primary.main;

  // Create gradient backgrounds
  const gradientBg = isDarkMode
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.background.paper,
        0.9
      )}, ${alpha(theme.palette.background.default, 0.8)})`
    : `linear-gradient(135deg, #ffffff, ${alpha(accentColor, 0.04)})`;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Card
        elevation={isDarkMode ? 4 : 1}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          background: gradientBg,
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${alpha(
              accentColor,
              0.7
            )}, ${alpha(accentColor, 0.9)})`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                color: accentColor,
                letterSpacing: "0.5px",
                mb: 0.5,
              }}
            >
              500 Meal Points
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Place Your Bid
            </Typography>
          </Box>

          <Divider sx={{ mt: 1, mb: 3, opacity: 0.6 }} />

          <form onSubmit={sendBid}>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Choose Transaction Type
              </Typography>

              <Stack direction="row" spacing={2}>
                <Paper
                  elevation={0}
                  onClick={() => setTransType("Buy")}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    flex: 1,
                    bgcolor:
                      transType === "Buy"
                        ? alpha(accentColor, isDarkMode ? 0.15 : 0.1)
                        : alpha(
                            theme.palette.background.default,
                            isDarkMode ? 0.4 : 0.7
                          ),
                    border: `1px solid ${
                      transType === "Buy"
                        ? alpha(accentColor, 0.3)
                        : alpha(theme.palette.divider, 0.1)
                    }`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[2],
                      bgcolor:
                        transType === "Buy"
                          ? alpha(accentColor, isDarkMode ? 0.18 : 0.12)
                          : alpha(
                              theme.palette.background.default,
                              isDarkMode ? 0.45 : 0.75
                            ),
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        bgcolor: alpha(
                          accentColor,
                          transType === "Buy" ? 0.15 : 0.08
                        ),
                        p: 1,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow:
                          transType === "Buy"
                            ? `0 4px 10px ${alpha(accentColor, 0.2)}`
                            : "none",
                      }}
                    >
                      <ShoppingCartIcon
                        sx={{
                          color:
                            transType === "Buy"
                              ? accentColor
                              : theme.palette.text.secondary,
                          fontSize: 20,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: transType === "Buy" ? 700 : 500,
                        color:
                          transType === "Buy"
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                      }}
                    >
                      Buy
                    </Typography>
                  </Stack>
                  <Radio
                    checked={transType === "Buy"}
                    onChange={(e) => setTransType(e.target.value)}
                    value="Buy"
                    name="Transact"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                  />
                </Paper>

                <Paper
                  elevation={0}
                  onClick={() => setTransType("Sell")}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    flex: 1,
                    bgcolor:
                      transType === "Sell"
                        ? alpha(accentColor, isDarkMode ? 0.15 : 0.1)
                        : alpha(
                            theme.palette.background.default,
                            isDarkMode ? 0.4 : 0.7
                          ),
                    border: `1px solid ${
                      transType === "Sell"
                        ? alpha(accentColor, 0.3)
                        : alpha(theme.palette.divider, 0.1)
                    }`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[2],
                      bgcolor:
                        transType === "Sell"
                          ? alpha(accentColor, isDarkMode ? 0.18 : 0.12)
                          : alpha(
                              theme.palette.background.default,
                              isDarkMode ? 0.45 : 0.75
                            ),
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        bgcolor: alpha(
                          accentColor,
                          transType === "Sell" ? 0.15 : 0.08
                        ),
                        p: 1,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow:
                          transType === "Sell"
                            ? `0 4px 10px ${alpha(accentColor, 0.2)}`
                            : "none",
                      }}
                    >
                      <SellIcon
                        sx={{
                          color:
                            transType === "Sell"
                              ? accentColor
                              : theme.palette.text.secondary,
                          fontSize: 20,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: transType === "Sell" ? 700 : 500,
                        color:
                          transType === "Sell"
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                      }}
                    >
                      Sell
                    </Typography>
                  </Stack>
                  <Radio
                    checked={transType === "Sell"}
                    onChange={(e) => setTransType(e.target.value)}
                    value="Sell"
                    name="Transact"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                  />
                </Paper>
              </Stack>
            </Box>

            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                {transType === "Buy"
                  ? "Maximum Price to Pay for 500 Meal Points"
                  : "Minimum Price to Receive for 500 Meal Points"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 3, color: theme.palette.text.secondary }}
              >
                {transType === "Buy"
                  ? "You won't pay more than this amount"
                  : "You won't receive less than this amount"}
              </Typography>

              <Box sx={{ px: 1 }}>
                <Slider
                  aria-labelledby="input-slider"
                  id="Price"
                  name="Price"
                  value={bidData.Price}
                  onChange={update}
                  min={1}
                  max={500}
                  track={transType === "Sell" ? "inverted" : "normal"}
                  marks={[
                    { value: 1, label: "$1" },
                    { value: 100, label: "$100" },
                    { value: 200, label: "$200" },
                    { value: 300, label: "$300" },
                    { value: 400, label: "$400" },
                    { value: 500, label: "$500" },
                  ]}
                  sx={{
                    color: accentColor,
                    "& .MuiSlider-valueLabel": {
                      backgroundColor: accentColor,
                    },
                    "& .MuiSlider-markLabel": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 1,
                  mt: 2,
                }}
              >
                <Button
                  onClick={() => {
                    const newValue = Math.max(1, bidData.Price - 1);
                    // Create a synthetic event with a target containing the new value
                    const syntheticEvent = {
                      target: {
                        name: "Price",
                        value: newValue,
                      },
                    };
                    update(syntheticEvent);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: "36px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    p: 0,
                    mr: 2,
                    border: `1.5px solid ${alpha(accentColor, 0.5)}`,
                    color: accentColor,
                    "&:hover": {
                      border: `1.5px solid ${accentColor}`,
                      bgcolor: alpha(accentColor, 0.04),
                    },
                  }}
                >
                  -
                </Button>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: accentColor,
                    mx: 2,
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  ${bidData.Price}
                </Typography>
                <Button
                  onClick={() => {
                    const newValue = Math.min(500, bidData.Price + 1);
                    // Create a synthetic event with a target containing the new value
                    const syntheticEvent = {
                      target: {
                        name: "Price",
                        value: newValue,
                      },
                    };
                    update(syntheticEvent);
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: "36px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    p: 0,
                    ml: 2,
                    border: `1.5px solid ${alpha(accentColor, 0.5)}`,
                    color: accentColor,
                    "&:hover": {
                      border: `1.5px solid ${accentColor}`,
                      bgcolor: alpha(accentColor, 0.04),
                    },
                  }}
                >
                  +
                </Button>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 4,
                  minWidth: 180,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: `0 4px 14px ${alpha(accentColor, 0.3)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 6px 20px ${alpha(accentColor, 0.4)}`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Place Bid
              </Button>
            </Box>

            {/* Error Message */}
            {errorMessage && (
              <Fade in={!!errorMessage}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    "& .MuiAlert-icon": {
                      alignItems: "center",
                    },
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.error.main,
                      0.15
                    )}`,
                  }}
                >
                  <Typography variant="body2">{errorMessage}</Typography>
                </Alert>
              </Fade>
            )}
          </form>

          {/* Info Box */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.info.main, isDarkMode ? 0.08 : 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon
              sx={{
                color: theme.palette.info.main,
                fontSize: 20,
                mr: 2,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Increasing the range of accepted prices will increase your chances
              of being matched with another student.
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Transact;
