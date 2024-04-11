import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import {
  Button,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

function SubmitFeedback() {
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const { authToken } = useAuth();
  const config = useConfig();

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          subject: feedbackSubject,
          feedback: feedbackMessage,
        }),
      });

      const data = await response.json();
      if (response.ok && data) {
        setFeedbackSuccess("Feedback submitted successfully");
        setFeedbackError("");
        setFeedbackMessage("");
        setFeedbackSubject("");
      } else {
        setFeedbackError(data.message);
        setFeedbackSuccess("");
      }
    } catch (error) {
      setFeedbackError("Something went wrong. Please try again");
      setFeedbackSuccess("");
    }
  };
  return (
    <div>
      <p className="text-xl font-bold my-4 text-gray-800">Submit Feedback</p>
      <form
        onSubmit={handleFeedbackSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <FormControl fullWidth>
          <InputLabel id="feedback-subject-label">Subject</InputLabel>
          <Select
            labelId="feedback-subject-label"
            id="feedback-subject"
            value={feedbackSubject}
            label="Subject"
            onChange={(e) => setFeedbackSubject(e.target.value)}
            required
          >
            <MenuItem value={"Report a bug"}>Report a bug</MenuItem>
            <MenuItem value={"Suggest Changes"}>Suggest Changes</MenuItem>
            <MenuItem value={"Ask a question"}>Ask a question</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Your Message"
          variant="outlined"
          multiline
          rows={4}
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          required
        />
        {feedbackError && <Alert severity="error">{feedbackError}</Alert>}
        {feedbackSuccess && <Alert severity="success">{feedbackSuccess}</Alert>}
        <div className="btn-wrapper">
          <Button type="submit" variant="contained" color="primary">
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SubmitFeedback;
