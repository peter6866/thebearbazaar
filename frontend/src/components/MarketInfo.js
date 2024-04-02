import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

function MarketInfo({ info }) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h4>Number of Buyers:</h4>
          <Typography>{info.numBuyers}</Typography>
        </Grid>
        <Grid item xs={6}>
          <h4>Number of Sellers:</h4>
          <Typography>{info.numSellers}</Typography>
        </Grid>
        <Grid item xs={6}>
          <h4>Competitive Buy Price:</h4>
          <Typography>
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
          <h4>Competitive Sell Price:</h4>
          <Typography>
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
