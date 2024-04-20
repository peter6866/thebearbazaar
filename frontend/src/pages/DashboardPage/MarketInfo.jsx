import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

function MarketInfo({ info }) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <p className="text-md font-bold my-4 text-gray-800">
            Number of Buyers:
          </p>
          <Typography>{info.numBuyers}</Typography>
        </Grid>
        <Grid item xs={6}>
          <p className="text-md font-bold my-4 text-gray-800">
            Number of Sellers:
          </p>
          <Typography>{info.numSellers}</Typography>
        </Grid>
        <Grid item xs={6}>
          <p className="text-md font-bold my-4 text-gray-800">
            Competitive Buy Price:
          </p>
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
          <p className="text-md font-bold my-4 text-gray-800">
            Competitive Sell Price:
          </p>
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
