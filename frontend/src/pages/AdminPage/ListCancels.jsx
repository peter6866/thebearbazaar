import React, { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import moment from "moment-timezone";

function formatDate(isoString) {
  const date = moment.utc(isoString);
  return date.local().format("MM/DD/YYYY");
}

function ListCancels() {
  const [cancels, setCancels] = useState([]);
  const config = useConfig();
  const { authToken } = useAuth();

  const fetchCancels = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/get-cancels`,
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
        setCancels(data.cancels);
      }
    } catch (error) {}
  }, [authToken, config]);

  useEffect(() => {
    fetchCancels();
  }, [fetchCancels]);

  return (
    <Box>
      <p className="text-xl font-bold my-4 text-gray-800">Canceled Matches</p>
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
              <TableRow>
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
