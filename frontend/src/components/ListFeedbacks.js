import React, { useState, useEffect } from "react";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";
import { List, ListItem, ListItemText, Divider } from "@mui/material";

function ListFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const config = useConfig();
  const { authToken } = useAuth();

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/feedback/get-feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [authToken]);

  return (
    <div>
      <h3>Feedbacks</h3>
      <List>
        {feedbacks.map((feedback, index) => (
          <React.Fragment key={feedback.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={feedback.subject}
                secondary={
                  <>
                    <span>From: {feedback.userEmail}</span>
                    <br />
                    {feedback.feedback}
                  </>
                }
              />
            </ListItem>
            {index < feedbacks.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default ListFeedback;
