import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

  let requestCode = async (e) => {
    e.preventDefault();
    console.log(config);

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/users/get-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData["email"] }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        nextStep();
      }
    } catch (error) {}
  };

  let resendCode = async (e) => {
    e.preventDefault();

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
        login(data.token);
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
    <div className="auth-container-inner">
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
              label="email@wustl.edu"
              variant="standard"
              onChange={update}
            />
          </div>
          <div>
            <Button onClick={requestCode} variant="contained">
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
          <div>
            <Button onClick={resendCode} variant="contained">
              Get a New Code
            </Button>
          </div>
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
          <div>
            <Button onClick={signUp} variant="contained">
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
      <div onClick={flip}>Already have an account? Login instead.</div>
    </div>
  );
}

export default SignUp;
