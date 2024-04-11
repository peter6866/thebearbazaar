import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
} from "@mui/material";

function ListFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const config = useConfig();
  const { authToken } = useAuth();

  const fetchFeedbacks = useCallback(async () => {
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
  }, [authToken, config]);

  const removeFeedback = async (id) => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/feedback/remove-feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            feedback_id: id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        fetchFeedbacks();
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return (
    <Box>
      <p className="text-xl font-bold my-4 text-gray-800">Feedback</p>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell> {/* New cell for action */}
              <TableCell>Subject</TableCell>
              <TableCell>From</TableCell>
              <TableCell>Feedback</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>
                  <DeleteIcon
                    onClick={() => removeFeedback(feedback.id)}
                    color="primary"
                    style={{ cursor: "pointer" }}
                  />
                </TableCell>
                <TableCell>{feedback.subject}</TableCell>
                <TableCell>{feedback.userEmail}</TableCell>
                <TableCell>{feedback.feedback}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListFeedback;
