import { Box, Typography, Grid } from "@mui/material";

function MarketInfo({ info }) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              fontWeight: "bold",
              my: "1rem",
              color: "text.primary",
            }}
          >
            Number of Buyers:
          </Typography>
          <Typography color="textPrimary">{info.numBuyers}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              fontWeight: "bold",
              my: "1rem",
              color: "text.primary",
            }}
          >
            Number of Sellers:
          </Typography>
          <Typography color="textPrimary">{info.numSellers}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              fontWeight: "bold",
              my: "1rem",
              color: "text.primary",
            }}
          >
            Competitive Buy Price:
          </Typography>
          <Typography color="textPrimary">
            {info.buyPrice !== 0 ? `$${info.buyPrice}` : "None"}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: "1rem" }}
          >
            Buying above this price range increases your chance of matching with
            a seller.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="body1"
            component="p"
            sx={{
              fontWeight: "bold",
              my: "1rem",
              color: "text.primary",
            }}
          >
            Competitive Sell Price:
          </Typography>
          <Typography color="textPrimary">
            {info.sellPrice !== 0 ? `$${info.sellPrice}` : "None"}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ marginTop: "1rem" }}
          >
            Selling under this price range increases your chance of matching
            with a buyer.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MarketInfo;
