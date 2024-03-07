import React, { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

function QAPair({ data, handleDeleteFAQ, role }) {
  const { question, answer } = data;

  return (
    <Accordion style={{ width: "100%" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          <strong>Q</strong>: {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <strong>A</strong>: {answer}
        </Typography>
        {role === "admin" && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteFAQ(question)}
            sx={{ marginTop: "1rem" }}
          >
            Delete
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default QAPair;
