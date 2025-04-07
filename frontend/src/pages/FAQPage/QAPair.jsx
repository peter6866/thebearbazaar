// import React from "react";
// import Accordion from "@mui/material/Accordion";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Button from "@mui/material/Button";

// function QAPair({ data, handleDeleteFAQ, role }) {
//   const { question, answer } = data;

//   return (
//     <Accordion style={{ width: "100%" }}>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography>
//           <strong>Q</strong>: {question}
//         </Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         <Typography>
//           <strong>A</strong>: {answer}
//         </Typography>
//         {role === "admin" && (
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => handleDeleteFAQ(question)}
//             sx={{ marginTop: "1rem" }}
//           >
//             Delete
//           </Button>
//         )}
//       </AccordionDetails>
//     </Accordion>
//   );
// }

// export default QAPair;

import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
  Box,
  alpha,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

function QAPair({ data, handleDeleteFAQ, role }) {
  const { question, answer } = data;
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: "12px !important",
        overflow: "hidden",
        mb: 1,
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          boxShadow: isDarkMode
            ? `0 4px 12px ${alpha("#000", 0.15)}`
            : `0 4px 12px ${alpha("#000", 0.05)}`,
          transition: "box-shadow 0.3s ease, background-color 0.3s ease",
        },
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: theme.palette.primary.main,
              transition: "transform 0.3s ease",
            }}
          />
        }
        sx={{
          px: 3,
          py: 1.5,
          "&.Mui-expanded": {
            minHeight: "48px",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
          "& .MuiAccordionSummary-content": {
            m: 0,
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            m: 0,
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          <strong>Q</strong>: {question}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.3),
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
          }}
        >
          <strong>A</strong>: {answer}
        </Typography>

        {role === "admin" && (
          <>
            <Divider sx={{ mt: 3, mb: 2, opacity: 0.6 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFAQ(question);
                }}
                startIcon={<DeleteIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                  py: 0.75,
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default QAPair;
