import { Typography, Paper, Button } from "@mui/material";

function ViewBid({bidType, bidPrice, cancelBid}) {
  const today = new Date();
    const daysUntilNextSunday = 7 - today.getDay();
    const nextSundayTimestamp =
        today.getTime() + daysUntilNextSunday * 24 * 60 * 60 * 1000;
    const nextSunday = new Date(nextSundayTimestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

  return (
  
      
        <Paper elevation={3} style={{ padding: "2rem" }}>
        <h3>Bid Information</h3>
        <div>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "10px" }}
          >
            <strong>Match Date:</strong> {nextSunday}{" "}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "10px" }}
          >
            <strong>Bid Type:</strong> {bidType}{" "}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            style={{ marginBottom: "20px" }}
          >
            <strong>Bid Price:</strong> ${bidPrice}{" "}
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
