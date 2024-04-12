import React, { useState } from "react";
import { Button, TextField, Alert, Box } from "@mui/material";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";

function BanUser() {
  const config = useConfig();
  const { authToken } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleBanUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/ban-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ userEmail }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        setSuccess("");
        return;
      } else {
        setSuccess(data.message);
        setError("");
        return;
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setSuccess("");
    }
  };

  return (
    <div>
      <p className="text-xl font-bold my-4 text-gray-800">Ban User</p>
      <form onSubmit={handleBanUser}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="User Email"
            variant="standard"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Ban
          </Button>
        </Box>
      </form>
      {error && (
        <Alert
          severity="error"
          sx={{
            marginTop: 2,
          }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{
            marginTop: 2,
          }}
        >
          {success}
        </Alert>
      )}
    </div>
  );
}

export default BanUser;
