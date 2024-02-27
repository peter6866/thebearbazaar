import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { useNavigate } from "react-router-dom";

function Login({ flip }) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const config = useConfig();

  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  let update = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  let submitLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData["email"],
            password: userData["password"],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        login(data.token);
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="container-inner">
      <h3>Login</h3>

      <form onSubmit={submitLogin}>
        <div>
          <TextField
            fullWidth
            id="email"
            name="email"
            value={userData["email"]}
            label="WUSTL Email Address"
            variant="standard"
            onChange={update}
          />
        </div>
        <div>
          <TextField
            fullWidth
            type="password"
            id="password"
            name="password"
            value={userData["password"]}
            label="Password"
            variant="standard"
            onChange={update}
          />
        </div>
        <div class="btn-wrapper">
          <Button type="submit" variant="contained">
            Login
          </Button>
        </div>
        {errorMessage && (
          <div>
            <Alert severity="error">{errorMessage}</Alert>
          </div>
        )}
      </form>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Typography variant="body1">Need an account?</Typography>
        <Button
          onClick={flip}
          style={{ textTransform: "none", fontSize: "1rem" }}
        >
          Sign up.
        </Button>
      </Box>
    </div>
  );
}

export default Login;
