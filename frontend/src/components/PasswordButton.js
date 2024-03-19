import React from "react";
import { Button, List, ListItem, ListItemText, Alert } from "@mui/material";

const PasswordButton = ({ password = "", confirmPassword = "", children }) => {
  let requirements = [];

  if (password !== confirmPassword) {
    requirements.push("Passwords must match");
  }
  if (password.length < 8) {
    requirements.push("Password must contain at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    requirements.push("Password must contain an uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    requirements.push("Password must contain a lowercase letter");
  }
  const disabled = requirements.length !== 0;

  return (
    <div>
      {disabled && (password || confirmPassword) && (
        <div>
          <Alert severity="error" style={{ marginBottom: "2rem" }}>
            <List>
              {requirements.map((requirement, index) => (
                <ListItem key={index}>
                  <ListItemText primary={requirement} />
                </ListItem>
              ))}
            </List>
          </Alert>
        </div>
      )}
      <div className="btn-wrapper">
        <Button type="submit" variant="contained" disabled={disabled}>
          {children}
        </Button>
      </div>
    </div>
  );
};

export default PasswordButton;
