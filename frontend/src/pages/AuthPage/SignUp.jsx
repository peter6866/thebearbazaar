import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import PasswordButton from "../../components/PasswordButton";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TurnstileWidget from "../../components/TurnstileWidget";

function SignUp({ flip }) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirm: "",
    code: "",
  });

  const { login } = useAuth();
  let navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [turnstileToken, setTurnstileToken] = useState(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  let requestCode = async (e) => {
    e.preventDefault();

    if (!turnstileToken) {
      setErrorMessage("Please complete the verification.");
      return;
    }

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
        `${import.meta.env.VITE_API_URL}/v1/users/auth/code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData["email"],
            reset: false,
            turnstileToken,
          }),
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
        `${import.meta.env.VITE_API_URL}/v1/users/auth/resend`,
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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/users/auth/verify`,
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
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: "1rem",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        }}
      >
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
      </Typography>
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

          <TurnstileWidget
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() =>
              setErrorMessage("Verification failed. Please try again.")
            }
            onExpire={() => setTurnstileToken(null)}
          />

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
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={userData["password"]}
              label="Password"
              variant="standard"
              onChange={update}
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
              id="confirm"
              name="confirm"
              value={userData["confirm"]}
              label="Confirm Password"
              variant="standard"
              onChange={update}
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
            password={userData["password"]}
            confirmPassword={userData["confirm"]}
          >
            Sign up
          </PasswordButton>
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
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          Already have an account?
        </Typography>
        <Button
          onClick={flip}
          style={{ textTransform: "none", fontSize: "1rem" }}
        >
          Log in.
        </Button>
      </Box>
    </div>
  );
}

export default SignUp;
