// TODO: Create a home page for the Bear Bazaar
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Logout from "./Logout";
import Nav from "./Nav";

function HomePage() {
  const { isLoggedIn, logout, isLoading } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, isLoading, navigate]);

  return (
    <div className="container-outer">
      <Nav />
      <div>
        <Logout />
        <br></br>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate("/transact")}
        >
          Place a bid
        </Button>
        <p>View your bid</p>
        <p>Your buy/seller</p>
      </div>
    </div>
  );
}

export default HomePage;
