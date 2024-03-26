import { Typography, Paper, Button } from "@mui/material";

function ViewBid({ bidType, bidPrice, cancelBid }) {
  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Bid Information</h3>
      <div>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "10px" }}
        >
          You have an outstanding meal point bid for the following:{" "}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "10px" }}
        >
          <strong>Transaction Type:</strong> {bidType}
          {" 500 Meal Points"}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "20px" }}
        >
          {bidType === "Buy" ? (
            <strong>Maximum Price to Pay: </strong>
          ) : (
            <strong>Minimum Price to Receive: </strong>
          )}
          ${bidPrice}{" "}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          style={{ marginBottom: "20px" }}
        >
          If you would like to change your bid or no longer wish to exchange
          meal points, please cancel your bid immediately.{" "}
        </Typography>
        <div className="btn-wrapper">
          <Button variant="contained" onClick={cancelBid}>
            Cancel Bid
          </Button>
        </div>
      </div>
    </Paper>
  );
}

export default ViewBid;
