import React, { useState, useEffect, useCallback } from "react";

import { Typography, Paper, Button,  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle } from "@mui/material";

function ViewMatched({ matchedEmail, matchedType, matchedPrice, cancelTrans }) {
  // when click contact seller, redirect to send email
  const [openCancelTransDialog, setOpenCancelTransDialog] = useState(false);

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
    <Paper elevation={3} style={{ padding: "2rem", marginBottom: "20px" }}>
      <h3>Matching Information</h3>
      <div>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "10px" }}
        >
          A {matchedType === "Seller" ? "seller" : "buyer"} is matched based on
          your bid.
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "10px" }}
        >
          <strong>{matchedType}'s Email:</strong> {matchedEmail}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "20px" }}
        >
          <strong>Matched Price:</strong> ${matchedPrice}
        </Typography>
        <div className="double-button">
          <Button variant="contained" onClick={contactSeller}>
            Contact Seller
          </Button>
        
        <Button variant="contained" onClick={handleOpenCancelTransDialog}>
            Cancel Transaction
          </Button>
        </div>
        <Dialog
        open={openCancelTransDialog}
        onClose={handleCloseCancelTransDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Transaction"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelTransDialog}>Cancel</Button>
          <Button
            onClick={() => {
              cancelTrans();
              handleCloseCancelTransDialog();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </Paper>
  );
}

export default ViewMatched;
