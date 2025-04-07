// import React, { useState, useEffect, useCallback } from "react";
// import { useConfig } from "../../context/ConfigContext";
// import { useAuth } from "../../context/AuthContext";
// import QAPair from "./QAPair";
// import { Typography, Paper } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

// function Faq() {
//   const [questionsData, setQuestionsData] = useState([]);
//   const { config } = useConfig();
//   const { authToken, role } = useAuth();
//   const theme = useTheme();

//   const loadFAQ = useCallback(async () => {
//     if (!config || !config.REACT_APP_API_URL) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${config.REACT_APP_API_URL}/v1/faq/get-faq`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         console.log("ERROR");
//         return;
//       } else {
//         setQuestionsData(data.questions);
//       }
//     } catch (error) {}
//   }, [config]);

//   const handleDeleteFAQ = async (question) => {
//     try {
//       const response = await fetch(`${config.REACT_APP_API_URL}/v1/faq`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${authToken}`,
//         },
//         body: JSON.stringify({ question }),
//       });

//       if (!response.ok) {
//         console.log("ERROR");
//         return;
//       } else {
//         loadFAQ();
//       }
//     } catch (error) {}
//   };

//   useEffect(() => {
//     loadFAQ();
//   }, [loadFAQ]);

//   return (
//     <Paper
//       elevation={1}
//       sx={{
//         p: 4,
//         borderRadius: 2,
//         border: 1,
//         borderColor: theme.palette.mode === "dark" ? "grey.800" : "#e5e7eb",
//       }}
//     >
//       <Typography
//         variant="h6"
//         component="p"
//         fontWeight="bold"
//         my={2}
//         color="text.primary"
//       >
//         Frequently Asked Questions
//       </Typography>
//       {questionsData.map((item, index) => (
//         <QAPair
//           key={index}
//           data={{
//             question: item.question,
//             answer: item.answer,
//           }}
//           handleDeleteFAQ={handleDeleteFAQ}
//           role={role}
//         />
//       ))}
//     </Paper>
//   );
// }

// export default Faq;

import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import QAPair from "./QAPair";
import {
  Typography,
  Paper,
  Box,
  Container,
  alpha,
  InputAdornment,
  TextField,
  Fade,
  Chip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

function Faq() {
  const [questionsData, setQuestionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const { config } = useConfig();
  const { authToken, role } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Create gradient backgrounds
  const gradientBg = isDarkMode
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.background.paper,
        0.9
      )}, ${alpha(theme.palette.background.default, 0.8)})`
    : `linear-gradient(135deg, #ffffff, ${alpha(
        theme.palette.primary.main,
        0.03
      )})`;

  const loadFAQ = useCallback(async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/faq/get-faq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("ERROR");
        return;
      } else {
        setQuestionsData(data.questions);
        setFilteredQuestions(data.questions);
      }
    } catch (error) {}
  }, [config]);

  const handleDeleteFAQ = async (question) => {
    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/faq`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        console.log("ERROR");
        return;
      } else {
        loadFAQ();
      }
    } catch (error) {}
  };

  // Filter questions when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredQuestions(questionsData);
    } else {
      const filtered = questionsData.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  }, [searchTerm, questionsData]);

  useEffect(() => {
    loadFAQ();
  }, [loadFAQ]);

  return (
    <Container maxWidth="md">
      <Paper
        elevation={isDarkMode ? 4 : 1}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          background: gradientBg,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${alpha(
              theme.palette.primary.main,
              0.7
            )}, ${alpha(theme.palette.primary.main, 0.9)})`,
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Frequently Asked Questions
            </Typography>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "90%" }}
          >
            Find answers to common questions about meal point exchanges at Bear
            Bazaar. If you need additional help, please contact our support team
            or submit a feedback.
          </Typography>

          {/* Search field */}
          <TextField
            fullWidth
            placeholder="Search for questions or answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                "& fieldset": {
                  borderColor: alpha(theme.palette.divider, 0.2),
                },
                "&:hover fieldset": {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {searchTerm && (
            <Box sx={{ mb: 3 }}>
              <Chip
                label={`${filteredQuestions.length} result${
                  filteredQuestions.length !== 1 ? "s" : ""
                } for "${searchTerm}"`}
                variant="outlined"
                onDelete={() => setSearchTerm("")}
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  px: 1,
                }}
              />
            </Box>
          )}

          {/* FAQ List */}
          {filteredQuestions.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {filteredQuestions.map((item, index) => (
                <Fade
                  in={true}
                  key={index}
                  style={{
                    transitionDelay: `${index * 30}ms`,
                    transitionDuration: "300ms",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <QAPair
                      data={{
                        question: item.question,
                        answer: item.answer,
                      }}
                      handleDeleteFAQ={handleDeleteFAQ}
                      role={role}
                    />
                  </Box>
                </Fade>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                backgroundColor: alpha(theme.palette.background.paper, 0.3),
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No questions match your search.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search terms or clear the search.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Faq;
