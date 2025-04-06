import { Box, Typography, Grid, Paper, useTheme, alpha } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

function MarketInfo({ info }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box>
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: isDarkMode
                ? alpha(theme.palette.background.default, 0.4)
                : alpha(theme.palette.background.default, 0.7),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      p: 0.5,
                      borderRadius: "50%",
                      display: "flex",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      mr: 1,
                    }}
                  >
                    <PeopleOutlineIcon
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Buyers
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    ml: 0.5,
                  }}
                >
                  {info.numBuyers}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      p: 0.5,
                      borderRadius: "50%",
                      display: "flex",
                      bgcolor: alpha(theme.palette.primary.washuGreen, 0.1),
                      mr: 1,
                    }}
                  >
                    <PeopleOutlineIcon
                      fontSize="small"
                      sx={{ color: theme.palette.primary.washuGreen }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Sellers
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    ml: 0.5,
                  }}
                >
                  {info.numSellers}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              height: "100%",
              bgcolor: alpha(
                theme.palette.primary.main,
                isDarkMode ? 0.08 : 0.04
              ),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingUpIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main, mr: 1 }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                Competitive Buy Price
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 1.5,
              }}
            >
              {info.buyPrice !== 0 ? `$${info.buyPrice}` : "None"}
            </Typography>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                  fontSize: "0.8125rem",
                }}
              >
                Buying <strong>above</strong> this price increases your chance
                of matching with a seller.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              height: "100%",
              bgcolor: alpha(
                theme.palette.primary.washuGreen,
                isDarkMode ? 0.08 : 0.04
              ),
              border: `1px solid ${alpha(
                theme.palette.primary.washuGreen,
                0.1
              )}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingDownIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.washuGreen, mr: 1 }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                Sell Price
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.washuGreen,
                mb: 1.5,
              }}
            >
              {info.sellPrice !== 0 ? `$${info.sellPrice}` : "None"}
            </Typography>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.primary.washuGreen, 0.08),
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.5,
                  fontSize: "0.8125rem",
                }}
              >
                Selling <strong>under</strong> this price increases your chance
                of matching with a buyer.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MarketInfo;
