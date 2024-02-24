// TODO: Create a home page for the Bear Bazaar
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Logout() {
  const { isLoggedIn, logout } = useAuth();
  let navigate = useNavigate();

  let logoutAndLeave = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h3>Welcome back!</h3>
      <Button onClick={logoutAndLeave} variant="contained">
        Logout
      </Button>
    </div>
  );
}

export default Logout;
