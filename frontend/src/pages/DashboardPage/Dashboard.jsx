import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";
import PriceHistory from "./PriceHistory";
import MarketInfo from "./MarketInfo";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Button,
  Container,
  useTheme,
  alpha,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  AccessTime as ClockIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useConfig } from "../../context/ConfigContext";
import { useSelector } from "react-redux";
import { selectHasBid, selectIsMatched } from "../../features/bidSlice";
import axios from "axios";

function Dashboard({ useInAuth = false }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { config } = useConfig();
  const [priceHistory, setPriceHistory] = useState([]);
  const [matchTime, setMatchTime] = useState();
  const [marketInfo, setMarketInfo] = useState({
    numBuyers: "",
    numSellers: "",
    buyPrice: 0,
    sellPrice: 0,
  });

  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");

  const hasBid = useSelector(selectHasBid);
  const isMatched = useSelector(selectIsMatched);

  // Create gradient backgrounds
  const gradientBg = isDarkMode
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.background.paper,
        0.9
      )}, ${alpha(theme.palette.background.default, 0.8)})`
    : `linear-gradient(135deg, #ffffff, ${alpha(
        theme.palette.primary.main,
        0.03
      )})`;

  const loadPriceHistory = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/price-history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setPriceHistory(data.matchHistory);
      }
    } catch (error) {}
  }, [config]);

  const loadMatchTime = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/settings/schedule`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setMatchTime(data.matchTime);
      }
    } catch (error) {}
  }, [config]);

  const loadMarketInfo = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await axios.get(
        `${config.REACT_APP_API_URL}/v1/bids/market`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        setMarketInfo(response.data.info);
      }
    } catch (error) {
      setInfoSnackbarMessage("Failed to load market information.");
      setInfoSnackbarOpen(true);
    }
  }, [config]);

  useEffect(() => {
    loadPriceHistory();
    loadMatchTime();
    loadMarketInfo();
  }, [loadPriceHistory, loadMatchTime, loadMarketInfo]);

  const handleSnackbarClose = () => {
    setInfoSnackbarOpen(false);
  };

  const navigateToPlaceBid = () => {
    navigate("/mybid");
  };

  return (
    <Container>
      <Stack spacing={4} sx={{ pb: 4 }}>
        <Card
          elevation={isDarkMode ? 4 : 0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            background: gradientBg,
            border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${alpha(
                theme.palette.primary.main,
                0.7
              )}, ${alpha(theme.palette.primary.main, 0.9)})`,
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Welcome to The Bear Bazaar!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Exchange meal points easily with other students
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
              }}
            >
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {/* Step 1 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: theme.palette.primary.main,
                      boxShadow: `0 0 0 4px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                      mr: 2,
                    }}
                  >
                    <CartIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Place a bid
                  </Typography>
                </Box>

                {/* Step 2 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        hasBid || isMatched
                          ? theme.palette.primary.main
                          : alpha(theme.palette.text.secondary, 0.2),
                      boxShadow:
                        hasBid || isMatched
                          ? `0 0 0 4px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : "none",
                      mr: 2,
                    }}
                  >
                    <ClockIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color:
                        hasBid || isMatched
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                    }}
                  >
                    Wait for match
                  </Typography>
                </Box>

                {/* Step 3 */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        !hasBid && isMatched
                          ? theme.palette.primary.main
                          : alpha(theme.palette.text.secondary, 0.2),
                      boxShadow:
                        !hasBid && isMatched
                          ? `0 0 0 4px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : "none",
                      mr: 2,
                    }}
                  >
                    <PeopleIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color:
                        !hasBid && isMatched
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                    }}
                  >
                    Complete trade
                  </Typography>
                </Box>
              </Box>

              {/* DESKTOP VIEW - Horizontal Steps with Line */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  position: "relative",
                  alignItems: "center",
                }}
              >
                {/* Step 1 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                    width: "33%",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: theme.palette.primary.main,
                      mb: 1,
                      boxShadow: `0 0 0 4px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                    }}
                  >
                    <CartIcon sx={{ color: "white" }} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Place a bid
                  </Typography>
                </Box>

                {/* Step 2 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                    width: "33%",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        hasBid || isMatched
                          ? theme.palette.primary.main
                          : alpha(theme.palette.text.secondary, 0.2),
                      mb: 1,
                      boxShadow:
                        hasBid || isMatched
                          ? `0 0 0 4px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : "none",
                    }}
                  >
                    <ClockIcon sx={{ color: "white" }} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color:
                        hasBid || isMatched
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                    }}
                  >
                    Wait for match
                  </Typography>
                </Box>

                {/* Step 3 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                    width: "33%",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        !hasBid && isMatched
                          ? theme.palette.primary.main
                          : alpha(theme.palette.text.secondary, 0.2),
                      mb: 1,
                      boxShadow:
                        !hasBid && isMatched
                          ? `0 0 0 4px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`
                          : "none",
                    }}
                  >
                    <PeopleIcon sx={{ color: "white" }} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color:
                        !hasBid && isMatched
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                    }}
                  >
                    Complete trade
                  </Typography>
                </Box>

                {/* Connecting line in background */}
                <Box
                  sx={{
                    position: "absolute",
                    height: 2,
                    width: "68%",
                    bgcolor: alpha(theme.palette.text.secondary, 0.2),
                    top: 25,
                    left: "15%",
                    zIndex: 0,
                  }}
                />
              </Box>

              {!hasBid && !isMatched && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={navigateToPlaceBid}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 4,
                      py: 1,
                      fontWeight: 600,
                      boxShadow: `0 4px 14px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 20px ${alpha(
                          theme.palette.primary.main,
                          0.4
                        )}`,
                      },
                    }}
                  >
                    Place a Bid Now
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={isDarkMode ? 4 : 0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            background: gradientBg,
            border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <InfoIcon
                sx={{
                  mr: 1.5,
                  color: theme.palette.primary.main,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Market Information for 500 Meal Points
              </Typography>
            </Box>
            <MarketInfo info={marketInfo} />
          </CardContent>
        </Card>

        <Card
          elevation={isDarkMode ? 4 : 0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            background: gradientBg,
            border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <ClockIcon
                sx={{
                  mr: 1.5,
                  color: theme.palette.primary.main,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Next Matching
              </Typography>
            </Box>
            <Countdown target={matchTime} />
          </CardContent>
        </Card>

        <Card
          elevation={isDarkMode ? 4 : 0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            background: gradientBg,
            border: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <TrendingUpIcon
                sx={{
                  mr: 1.5,
                  color: theme.palette.primary.main,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Price History
              </Typography>
            </Box>
            <PriceHistory history={priceHistory} useInAuth={useInAuth} />
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={infoSnackbarOpen}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          {infoSnackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
