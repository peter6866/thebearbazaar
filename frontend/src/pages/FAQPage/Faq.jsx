import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import QAPair from "./QAPair";
import { Typography } from "@mui/material";

function Faq() {
  const [questionsData, setQuestionsData] = useState([]);
  const { config } = useConfig();
  const { authToken, role } = useAuth();

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
    <>
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
    </>
  );
}

export default Faq;
