import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Paper,
  Grid,
  Alert,
  useTheme,
  alpha,
  Divider,
  Fade,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";

const ViewBid = ({ bidType, bidPrice, cancelBid }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const accentColor = theme.palette.primary.main;

  const gradientBg = isDarkMode
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.background.paper,
        0.9
      )}, ${alpha(theme.palette.background.default, 0.8)})`
    : `linear-gradient(135deg, #ffffff, ${alpha(accentColor, 0.04)})`;

  return (
    <Box sx={{ maxWidth: 550, mx: "auto" }}>
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
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: accentColor,
                  letterSpacing: "0.5px",
                }}
              >
                Bid Information
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  mt: 0.5,
                }}
              >
                Meal Point Exchange
              </Typography>
            </Box>

            <Chip
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <span>Active</span>
                </Box>
              }
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: alpha(theme.palette.success.main, 0.15),
                color: theme.palette.success.main,
                borderRadius: "16px",
                pl: 0.5,
                pr: 1,
              }}
            />
          </Box>

          <Divider sx={{ mt: 1, mb: 3, opacity: 0.6 }} />

          <Stack spacing={3} sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: alpha(accentColor, isDarkMode ? 0.08 : 0.04),
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Grid container spacing={2.5} alignItems="center">
                <Grid item>
                  <Box
                    sx={{
                      bgcolor: alpha(accentColor, 0.15),
                      p: 1.5,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 10px ${alpha(accentColor, 0.2)}`,
                    }}
                  >
                    <ShoppingCartIcon
                      sx={{
                        color: accentColor,
                        fontSize: 24,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 0.5,
                    }}
                  >
                    Transaction Type
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: "1.1rem",
                    }}
                  >
                    {bidType} 500 Meal Points
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: alpha(accentColor, isDarkMode ? 0.08 : 0.04),
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Grid container spacing={2.5} alignItems="center">
                <Grid item>
                  <Box
                    sx={{
                      bgcolor: alpha(accentColor, 0.15),
                      p: 1.5,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 10px ${alpha(accentColor, 0.2)}`,
                    }}
                  >
                    <AttachMoneyIcon
                      sx={{
                        color: accentColor,
                        fontSize: 24,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {bidType === "Buy"
                      ? "Maximum Price to Pay"
                      : "Minimum Price to Receive"}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: accentColor,
                      letterSpacing: "0.25px",
                      textShadow: isDarkMode
                        ? `0 0 8px ${alpha(accentColor, 0.3)}`
                        : "none",
                    }}
                  >
                    ${bidPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>

          <Fade in={true}>
            <Alert
              severity="warning"
              sx={{
                mb: 4,
                borderRadius: 3,
                "& .MuiAlert-icon": {
                  alignItems: "center",
                },
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.warning.main,
                  0.15
                )}`,
              }}
            >
              <Typography variant="body2">
                If you would like to change your bid or no longer wish to
                exchange meal points, please cancel your bid immediately.
              </Typography>
            </Alert>
          </Fade>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={cancelBid}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 3,
                py: 1.2,
                px: 4,
                textTransform: "none",
                fontWeight: 600,
                minWidth: "200px",
                boxShadow: `0 4px 14px ${alpha(theme.palette.error.main, 0.3)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.error.main,
                    0.4
                  )}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Cancel Bid
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewBid;
