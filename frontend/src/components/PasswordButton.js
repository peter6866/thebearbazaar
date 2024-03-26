import React from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  show,
} from "@mui/material";

const PasswordButton = ({
  password = "",
  confirmPassword = "",
  children,
  show = true,
}) => {
  return (
    <div>
      {show && (
        <div>
          <List width="100%" disablePadding="true">
            <ListItem sx={{ padding: 0 }}>
              {password != confirmPassword && (
                <Alert sx={{ width: "100%" }} size="sm" severity="error">
                  {"Passwords must match"}
                </Alert>
              )}
              {password == confirmPassword && (
                <Alert sx={{ width: "100%" }} size="sm" severity="success">
                  {"Passwords must match"}
                </Alert>
              )}
            </ListItem>

            <ListItem sx={{ padding: 0 }}>
              {password.length < 8 && (
                <Alert sx={{ width: "100%" }} size="sm" severity="error">
                  {"Passwords must contain at least 8 characters"}
                </Alert>
              )}
              {password.length >= 8 && (
                <Alert sx={{ width: "100%" }} size="sm" severity="success">
                  {"Passwords must contain at least 8 characters"}
                </Alert>
              )}
            </ListItem>

            <ListItem sx={{ padding: 0 }}>
              {!/[A-Z]/.test(password) && (
                <Alert sx={{ width: "100%" }} size="sm" severity="error">
                  {"Password must contain uppercase letter"}
                </Alert>
              )}
              {/[A-Z]/.test(password) && (
                <Alert sx={{ width: "100%" }} size="sm" severity="success">
                  {"Password must contain uppercase letter"}
                </Alert>
              )}
            </ListItem>

            <ListItem sx={{ padding: 0 }}>
              {!/[a-z]/.test(password) && (
                <Alert sx={{ width: "100%" }} size="sm" severity="error">
                  {"Password must contain lowercase letter"}
                </Alert>
              )}
              {/[a-z]/.test(password) && (
                <Alert sx={{ width: "100%" }} size="sm" severity="success">
                  {"Password must contain lowercase letter"}
                </Alert>
              )}
            </ListItem>
          </List>
          <br />
        </div>
      )}
      <div className="btn-wrapper">
        <Button type="submit" variant="contained">
          {children}
        </Button>
      </div>
    </div>
  );
};

export default PasswordButton;
