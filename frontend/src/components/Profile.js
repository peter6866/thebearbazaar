import React, { useState, useEffect } from "react";
import { Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { Switch, FormControlLabel, FormGroup } from "@mui/material";

function Profile() {
  const { email, authToken } = useAuth();
  const config = useConfig();

  const [matchNotifications, setMatchNotifications] = useState(false);
  const [priceNotifications, setPriceNotifications] = useState(false);

  let handleMatchNotifications = (e) => {
    const isChecked = e.target.checked;
    setMatchNotifications(isChecked);
  };

  let handlePriceNotifications = (e) => {
    const isChecked = e.target.checked;
    setPriceNotifications(isChecked);
  };

  let loadNotificationSettings = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/get-notifications`,
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
        setMatchNotifications(data.sendMatchNotifications);
        setPriceNotifications(data.sendPriceNotifications);
      }
    } catch (error) {}
  };

  let updateNotificationSettings = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/update-notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            sendMatchNotifications: matchNotifications,
            sendPriceNotifications: priceNotifications,
          }),
        }
      );
    } catch (error) {}
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  useEffect(() => {
    updateNotificationSettings();
  }, [matchNotifications, priceNotifications]);

  return (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Profile : {email}</h3>
      <div>
        <h4>Email Notification Settings</h4>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={matchNotifications}
                onChange={handleMatchNotifications}
              />
            }
            label="Matching Updates"
          />
          <FormControlLabel
            control={
              <Switch
                checked={priceNotifications}
                onChange={handlePriceNotifications}
              />
            }
            label="Price Changes"
          />
        </FormGroup>
      </div>
      <div>
        <h4>Change Password</h4>
      </div>
    </Paper>
  );
}

export default Profile;
