import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import QAPair from "./QAPair";
import { Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Faq() {
  const [questionsData, setQuestionsData] = useState([]);
  const { config } = useConfig();
  const { authToken, role } = useAuth();
  const theme = useTheme();

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

  useEffect(() => {
    loadFAQ();
  }, [loadFAQ]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        borderRadius: 2,
        border: 1,
        borderColor: theme.palette.mode === "dark" ? "grey.800" : "#e5e7eb",
      }}
    >
      <Typography
        variant="h6"
        component="p"
        fontWeight="bold"
        my={2}
        color="text.primary"
      >
        Frequently Asked Questions
      </Typography>
      {questionsData.map((item, index) => (
        <QAPair
          key={index}
          data={{
            question: item.question,
            answer: item.answer,
          }}
          handleDeleteFAQ={handleDeleteFAQ}
          role={role}
        />
      ))}
    </Paper>
  );
}

export default Faq;
