import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import { Delete, Archive } from "@mui/icons-material";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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

  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/feedback/delete-feedback`,
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

      if (response.ok) {
        fetchFeedbacks();
      }
    } catch (error) {}
  };

  const archiveFeedback = async (id) => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/feedback/archive-feedback`,
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
      <p className="text-xl font-bold my-4 text-gray-900">Feedback</p>

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
                  <Delete
                    onClick={() => deleteFeedback(feedback.id)}
                    color="primary"
                    style={{ cursor: "pointer", marginRight: "1rem" }}
                  />
                  <Archive
                    onClick={() => archiveFeedback(feedback.id)}
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
