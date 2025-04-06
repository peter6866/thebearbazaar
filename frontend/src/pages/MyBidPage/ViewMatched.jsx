import React, { useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";

const ViewMatched = ({
  matchedEmail,
  matchedPhone,
  matchedType,
  matchedPrice,
  cancelTrans,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [openCancelTransDialog, setOpenCancelTransDialog] = useState(false);

  // Use primary color for accent
  const accentColor = theme.palette.primary.main;

  // Create gradient backgrounds
  const gradientBg = isDarkMode
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.background.paper,
        0.9
      )}, ${alpha(theme.palette.background.default, 0.8)})`
    : `linear-gradient(135deg, #ffffff, ${alpha(accentColor, 0.04)})`;

  const contactSeller = () => {
    window.location.href = `mailto:${matchedEmail}`;
  };

  const handleOpenCancelTransDialog = () => {
    setOpenCancelTransDialog(true);
  };

  const handleCloseCancelTransDialog = () => {
    setOpenCancelTransDialog(false);
  };

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
                Match Information
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
                Matched with a {matchedType.toLowerCase()}
              </Typography>
            </Box>

            <Chip
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <span>Success</span>
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

          {/* Main Content */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            {/* Email */}
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
                    <EmailIcon
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
                    {matchedType}'s Email
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: "1.1rem",
                    }}
                  >
                    {matchedEmail}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Phone (if provided) */}
            {matchedPhone && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: alpha(accentColor, isDarkMode ? 0.08 : 0.04),
                  border: `1px solid ${alpha(accentColor, 0.3)}`,
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
                      <PhoneIcon
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
                      {matchedType}'s Phone
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: "1.1rem",
                      }}
                    >
                      {matchedPhone}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Price Information */}
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
                    Price
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
                    ${matchedPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>

          {/* Alert Messages */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            {matchedPhone && (
              <Fade in={true}>
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 3,
                    "& .MuiAlert-icon": {
                      alignItems: "center",
                    },
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.info.main,
                      0.15
                    )}`,
                  }}
                >
                  <Typography variant="body2">
                    The {matchedType.toLowerCase()} preferred to be contacted by{" "}
                    <strong>phone</strong>.
                  </Typography>
                </Alert>
              </Fade>
            )}

            <Fade in={true} style={{ transitionDelay: "150ms" }}>
              <Alert
                severity="info"
                sx={{
                  borderRadius: 3,
                  "& .MuiAlert-icon": {
                    alignItems: "center",
                  },
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.info.main,
                    0.15
                  )}`,
                }}
              >
                <Typography variant="body2">
                  Coordinate a time to meet at the Dining Services Office (in
                  BD) and carry out the transaction (M-F, 8:30 AM - 4:30 PM)
                </Typography>
              </Alert>
            </Fade>

            <Fade in={true} style={{ transitionDelay: "300ms" }}>
              <Alert
                severity="error"
                sx={{
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
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Do not pay the other person until at the Dining Services
                  Office!
                </Typography>
              </Alert>
            </Fade>
          </Stack>

          <Stack direction="row" spacing={2.5} sx={{ mt: 3 }}>
            <Button
              onClick={contactSeller}
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                borderWidth: 2,
                borderColor: alpha(accentColor, 0.5),
                color: accentColor,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: accentColor,
                  bgcolor: alpha(accentColor, 0.05),
                  transform: "translateY(-2px)",
                },
              }}
            >
              Contact {matchedType}
            </Button>
            <Button
              onClick={handleOpenCancelTransDialog}
              variant="contained"
              color="error"
              fullWidth
              sx={{
                borderRadius: 3,
                py: 1.2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: `0 4px 14px ${alpha(accentColor, 0.3)}`,
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
              Cancel Transaction
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={openCancelTransDialog}
        onClose={handleCloseCancelTransDialog}
        PaperProps={{
          style: {
            borderRadius: 16,
            padding: 8,
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(
                  theme.palette.background.paper,
                  0.95
                )}, ${alpha(theme.palette.background.default, 0.9)})`
              : `linear-gradient(135deg, #ffffff, ${alpha("#f5f7fa", 0.95)})`,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            color: theme.palette.text.primary,
            fontWeight: 700,
          }}
        >
          Cancel Transaction
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.95rem",
            }}
          >
            This action cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseCancelTransDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: theme.palette.text.secondary,
            }}
          >
            Go Back
          </Button>
          <Button
            onClick={() => {
              cancelTrans();
              handleCloseCancelTransDialog();
            }}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: `0 4px 10px ${alpha(theme.palette.error.main, 0.2)}`,
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewMatched;
