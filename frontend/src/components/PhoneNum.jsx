import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Alert,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";

function PhoneNum() {
  const config = useConfig();
  const { authToken } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usePhoneAsDefault, setUsePhoneAsDefault] = useState(false);
  const [isCheckboxChanged, setIsCheckboxChanged] = useState(false);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, "");

    const chars = numbers.split("");
    let formattedNumber = "";

    for (let i = 0; i < chars.length; i++) {
      if (i === 3 || i === 6) {
        formattedNumber += "-";
      }
      formattedNumber += chars[i];
    }

    return formattedNumber.slice(0, 12);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phoneNum = data.get("phoneNum");

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/phone-num`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ phoneNum }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError("");
        setPhoneNumber(phoneNum);
        setHasPhoneNumber(true);
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setSuccess("");
    }
  };

  const handleUpdatePreference = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/update-preference`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ isPrefered: usePhoneAsDefault }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError("");
        setIsCheckboxChanged(false);
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setSuccess("");
    }
  };

  const deleteNum = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/delete-num`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setHasPhoneNumber(false);
        setPhoneNumber("");
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const response = await fetch(
          `${config.REACT_APP_API_URL}/v1/users/phone-num`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setPhoneNumber(data.phoneNum);
          setUsePhoneAsDefault(data.isPrefered);
          setHasPhoneNumber(true);
        }
        setIsLoading(false);
      } catch (error) {}
    };
    fetchPhoneNumber();
  }, [config, authToken]);

  return (
    <div>
      <p className="text-md font-bold my-4 text-gray-800">
        Communication Preference
      </p>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            visibility: "hidden",
          }}
        >
          <p>---</p>
        </div>
      ) : (
        <>
          {hasPhoneNumber ? (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1" color="textPrimary">
                  Your phone number:
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {phoneNumber}
                </Typography>
              </Box>

              <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={usePhoneAsDefault}
                      onChange={(e) => {
                        setUsePhoneAsDefault(e.target.checked);
                        setIsCheckboxChanged(!isCheckboxChanged);
                      }}
                      color="primary"
                    />
                  }
                  label="Prefered communication method"
                />
              </div>
              {isCheckboxChanged && (
                <div>
                  <div className="btn-wrapper">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdatePreference}
                      sx={{ mt: 1 }}
                    >
                      Save Changes
                    </Button>
                  </div>
                  <br />
                </div>
              )}
              <div className="btn-wrapper">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={deleteNum}
                >
                  Delete Phone Number
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNum"
                  onChange={(e) =>
                    setPhoneNumber(formatPhoneNumber(e.target.value))
                  }
                  value={phoneNumber}
                  sx={{ flexGrow: 1, marginRight: "30px" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  add
                </Button>
              </Box>
            </form>
          )}
          {error && (
            <Alert severity="error" sx={{ marginTop: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ marginTop: 1 }}>
              {success}
            </Alert>
          )}
        </>
      )}
    </div>
  );
}

export default PhoneNum;
