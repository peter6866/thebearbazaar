import React, { useState } from "react";
import { Typography } from "@mui/material";
import SignUp from "./SignUp";
import Login from "./Login";

function Auth() {
  const [loginStep, setLoginStep] = useState(true);

  let flip = () => {
    setLoginStep(!loginStep);
  };

  return (
    <div className="container-outer">
      <Typography
        variant="h5"
        style={{ margin: "20px auto", textAlign: "center", width: "100%" }}
      >
        The Bear Bazaar
      </Typography>
      {loginStep && <Login flip={flip} />}
      {!loginStep && <SignUp flip={flip} />}
    </div>
  );
}

export default Auth;
