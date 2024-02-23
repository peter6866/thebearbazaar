// TODO: Create a home page for the Bear Bazaar
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Transact from "./Transact";

function HomePage() {
  const { isLoggedIn, logout } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  return (
    // FIXME: temporary style
    <div className="auth-container-outer">
      <div>
        <h1>Welcome back!</h1>
        <button onClick={logout}>Logout</button>
        <Transact />
      </div>
    </div>
  );
}

export default HomePage;
