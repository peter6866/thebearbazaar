import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { useNavigate } from "react-router-dom";

function SignUp({ flip }) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirm: "",
    code: "",
  });

  const { login } = useAuth();
  const config = useConfig();
  let navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  let requestCode = async (e) => {
    e.preventDefault();

    // Start the countdown and disable the button
    setIsButtonDisabled(true);
    setCountdown(60);
    let intervalId = setInterval(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          clearInterval(intervalId);
          setIsButtonDisabled(false);
          return null; // Reset the countdown
        }
        return currentCountdown - 1;
      });
    }, 1000);

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/get-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData["email"], reset: false }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        clearInterval(intervalId);
        setIsButtonDisabled(false);
        setCountdown(null);
      } else {
        nextStep();
      }
    } catch (error) {
      clearInterval(intervalId); // Ensure to clear interval on error
      setIsButtonDisabled(false);
      setCountdown(null);
    }
  };

  let resendCode = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setCountdown(60); // Reset countdown

    // Restart the countdown
    const timer = setInterval(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          clearInterval(timer);
          setIsButtonDisabled(false);
          return 0; // Stop the countdown
        }
        return currentCountdown - 1;
      });
    }, 1000);

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/resend-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData["email"] }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {}
  };

  let signUp = async (e) => {
    e.preventDefault();

    if (userData["password"] !== userData["confirm"]) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/signup-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData["email"],
            verificationCode: userData["code"],
            password: userData["password"],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        login(data.role, data.token);
        navigate("/");
      }
    } catch (error) {}
  };

  let update = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  let nextStep = () => {
    setStep(2);
    setErrorMessage("");
    setSuccessMessage("");
  };

  let prevStep = () => {
    setStep(1);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="container-inner">
      <h3>
        {step === 2 && (
          <IconButton
            aria-label="back"
            onClick={prevStep}
            size="small"
            sx={{ bgcolor: "transparent", border: "none", p: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        Sign Up
      </h3>
      {step === 1 && (
        <form onSubmit={requestCode}>
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
          <div className="btn-wrapper">
            <Button type="submit" variant="contained">
              Get One Time Code
            </Button>
          </div>
          {errorMessage && (
            <div>
              <Alert severity="error">{errorMessage}</Alert>
            </div>
          )}
        </form>
      )}
      {step === 2 && (
        <form onSubmit={signUp}>
          <div>
            <TextField
              fullWidth
              id="code"
              name="code"
              value={userData["code"]}
              label="Verification Code"
              variant="standard"
              onChange={update}
            />
          </div>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              onClick={resendCode}
              variant="contained"
              disabled={isButtonDisabled}
            >
              Send a New Code
            </Button>
            {isButtonDisabled && (
              <Typography variant="body2">Available in {countdown}s</Typography>
            )}
          </Box>
          {successMessage && (
            <div>
              <Alert severity="success">{successMessage}</Alert>
            </div>
          )}
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
          <div>
            <TextField
              fullWidth
              type="password"
              id="confirm"
              name="confirm"
              value={userData["confirm"]}
              label="Confirm Password"
              variant="standard"
              onChange={update}
            />
          </div>
          <div className="btn-wrapper">
            <Button type="submit" variant="contained">
              Sign Up
            </Button>
          </div>
          {errorMessage && (
            <div>
              <Alert severity="error">{errorMessage}</Alert>
            </div>
          )}
        </form>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Typography variant="body1">Already have an account?</Typography>
        <Button
          onClick={flip}
          style={{ textTransform: "none", fontSize: "1rem" }}
        >
          Login instead.
        </Button>
      </Box>
    </div>
  );
}

export default SignUp;
