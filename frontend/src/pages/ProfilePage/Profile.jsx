import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Alert,
  TextField,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";
import { Switch, FormControlLabel, FormGroup } from "@mui/material";
import PasswordButton from "../../components/PasswordButton";
import SubmitFeedback from "./SubmitFeedback";
import PhoneNum from "./PhoneNum";

function Profile() {
  const { authToken } = useAuth();
  const { config } = useConfig();

  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loadNotificationSettings = useCallback(async () => {
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
  }, [authToken, config]);

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

  const anyChanges = useCallback(() => {
    return (
      matchNotifications !== initialMatchNotifications ||
      priceNotifications !== initialPriceNotifications
    );
  }, [
    matchNotifications,
    priceNotifications,
    initialMatchNotifications,
    initialPriceNotifications,
  ]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [passwordFieldFocused, setPasswordFieldFocused] = useState(false);

  let updatePasswordText = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (!passwordFieldFocused) {
      if (value !== "") {
        setPasswordFieldFocused(true);
      }
    } else {
      if (value.length === 0) {
        switch (name) {
          case "oldPassword":
            if (
              passwordData["confirmNewPassword"].length === 0 &&
              passwordData["newPassword"].length === 0
            ) {
              setPasswordFieldFocused(false);
            }
            break;
          case "newPassword":
            if (
              passwordData["oldPassword"].length === 0 &&
              passwordData["confirmNewPassword"].length === 0
            ) {
              setPasswordFieldFocused(false);
            }
            break;
          case "confirmNewPassword":
            if (
              passwordData["oldPassword"].length === 0 &&
              passwordData["newPassword"].length === 0
            ) {
              setPasswordFieldFocused(false);
            }
            break;
          default:
            break;
        }
      }
    }
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
        setPasswordFieldFocused(false);
      } else {
        setPasswordErrorMessage(data.message);
        setPasswordSuccessMessage("");
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadNotificationSettings();
  }, [loadNotificationSettings]);

  useEffect(() => {
    setAreChanges(anyChanges());
  }, [anyChanges]);

  return loading ? (
    <div></div>
  ) : (
    <>
      <p className="text-xl font-bold my-4 text-gray-900">Profile</p>
      <PhoneNum />
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <div>
        <p className="text-md font-bold my-4 text-gray-900">
          Email Notification Settings
        </p>
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
              sx={{ color: "text.primary" }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={priceNotifications}
                  onChange={handlePriceNotifications}
                />
              }
              label="Price Changes"
              sx={{ color: "text.primary" }}
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
        <p className="text-md font-bold my-4 text-gray-900">Change Password</p>
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
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData["newPassword"]}
              onChange={updatePasswordText}
              label="New Password"
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={passwordData["confirmNewPassword"]}
              onChange={updatePasswordText}
              label="Confirm New Password"
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <PasswordButton
            password={passwordData["newPassword"]}
            confirmPassword={passwordData["confirmNewPassword"]}
            show={passwordFieldFocused}
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
      <Divider style={{ marginTop: "2rem", marginBottom: "3rem" }}></Divider>
      <SubmitFeedback />
    </>
  );
}

export default Profile;
