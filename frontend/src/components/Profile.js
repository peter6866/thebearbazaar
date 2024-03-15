import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Button,
  Alert,
  TextField,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { Switch, FormControlLabel, FormGroup } from "@mui/material";
import PasswordButton from "./PasswordButton";

function Profile() {
  const { authToken } = useAuth();
  const config = useConfig();

  const [matchNotifications, setMatchNotifications] = useState(false);
  const [priceNotifications, setPriceNotifications] = useState(false);
  const [initialMatchNotifications, setInitialMatchNotifications] =
    useState(false);
  const [initialPriceNotifications, setInitialPriceNotifications] =
    useState(false);
  const [areChanges, setAreChanges] = useState(false);
  const [notificationSuccessMessage, setNotificationSucessMessage] =
    useState(false);
  const [loading, setLoading] = useState(true);

  let handleMatchNotifications = (e) => {
    const isChecked = e.target.checked;
    setMatchNotifications(isChecked);
    setNotificationSucessMessage("");
  };

  let handlePriceNotifications = (e) => {
    const isChecked = e.target.checked;
    setPriceNotifications(isChecked);
    setNotificationSucessMessage("");
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
        setInitialMatchNotifications(data.sendMatchNotifications);
        setInitialPriceNotifications(data.sendPriceNotifications);
        setLoading(false);
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

      const data = await response.json();

      if (response.ok) {
        setNotificationSucessMessage(data.message);
        setInitialMatchNotifications(matchNotifications);
        setInitialPriceNotifications(priceNotifications);
      }
    } catch (error) {}
  };

  let anyChanges = () => {
    return (
      matchNotifications !== initialMatchNotifications ||
      priceNotifications !== initialPriceNotifications
    );
  };

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  let updatePasswordText = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  let updatePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData["oldPassword"],
            newPassword: passwordData["newPassword"],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setPasswordSuccessMessage(data.message);
        setPasswordErrorMessage("");
      } else {
        setPasswordErrorMessage(data.message);
        setPasswordSuccessMessage("");
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  useEffect(() => {
    setAreChanges(anyChanges());
  }, [
    matchNotifications,
    priceNotifications,
    initialMatchNotifications,
    initialPriceNotifications,
  ]);

  return loading ? (
    <div></div>
  ) : (
    <Paper elevation={3} style={{ padding: "2rem" }}>
      <h3>Profile</h3>
      <div>
        <h4>Email Notification Settings</h4>
        <form>
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
          <div className="btn-wrapper">
            <Button
              variant="contained"
              disabled={!areChanges}
              onClick={updateNotificationSettings}
            >
              Save Changes
            </Button>
          </div>
          {notificationSuccessMessage && (
            <div>
              <Alert severity="success">{notificationSuccessMessage}</Alert>
            </div>
          )}
        </form>
      </div>
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <div>
        <h4>Change Password</h4>
        <form onSubmit={updatePassword}>
          <div>
            <TextField
              fullWidth
              type="password"
              name="oldPassword"
              onChange={updatePasswordText}
              value={passwordData["oldPassword"]}
              label="Current Password"
              variant="standard"
            />
          </div>
          <div>
            <TextField
              fullWidth
              type="password"
              name="newPassword"
              value={passwordData["newPassword"]}
              onChange={updatePasswordText}
              label="New Password"
              variant="standard"
            />
          </div>
          <div>
            <TextField
              fullWidth
              type="password"
              name="confirmNewPassword"
              value={passwordData["confirmNewPassword"]}
              onChange={updatePasswordText}
              label="Confirm New Password"
              variant="standard"
            />
          </div>
          <PasswordButton
            password={passwordData["newPassword"]}
            confirmPassword={passwordData["confirmNewPassword"]}
          >
            Change Password
          </PasswordButton>
          {passwordSuccessMessage && (
            <div>
              <Alert severity="success">{passwordSuccessMessage}</Alert>
            </div>
          )}
          {passwordErrorMessage && (
            <div>
              <Alert severity="error">{passwordErrorMessage}</Alert>
            </div>
          )}
        </form>
      </div>
    </Paper>
  );
}

export default Profile;
