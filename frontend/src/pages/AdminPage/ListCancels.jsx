import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import moment from "moment-timezone";

function formatDate(isoString) {
  const date = moment.utc(isoString);
  return date.local().format("MM/DD/YYYY");
}

function ListCancels() {
  const [cancels, setCancels] = useState([]);
  const { authToken } = useAuth();

  const fetchCancels = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/match/cancellations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data) {
        setCancels(data.cancels);
      }
    } catch (error) {}
  }, [authToken]);

  useEffect(() => {
    fetchCancels();
  }, [fetchCancels]);

  return (
    <Box>
      <Typography
        variant="h6"
        component="p"
        fontWeight="bold"
        my={2}
        color="text.primary"
      >
        Canceled Matches
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cancels.map((cancel) => (
              <TableRow key={`${cancel.email}${cancel.createdAt}`}>
                <TableCell>{cancel.email}</TableCell>
                <TableCell>{formatDate(cancel.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListCancels;
