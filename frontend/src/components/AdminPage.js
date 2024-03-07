import React, { useState } from "react";
import { Paper, TextField, Button, Alert } from "@mui/material";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";

function AdminPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const config = useConfig();
  const { authToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.REACT_APP_API_URL}/v1/faq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setSuccess("");
      } else {
        setSuccess(data.message);
        setError("");

        setQuestion("");
        setAnswer("");
      }
    } catch (error) {
      setError("An error occurred");
      setSuccess("");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Post New FAQ</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <TextField
          label="Question"
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <TextField
          label="Answer"
          variant="outlined"
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button type="submit" variant="contained" color="primary">
          Post FAQ
        </Button>
      </form>
    </Paper>
  );
}

export default AdminPage;
