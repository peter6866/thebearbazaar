// TODO: Create a home page for the Bear Bazaar
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { isLoggedIn, logout } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/transact");
    } else {
      navigate("/auth");
    }
  }, [isLoggedIn]);

  return (
    <></>
    // FIXME: temporary style
    // <div className="container-outer">
    //   <div>
    //     <h1>Welcome back!</h1>
    //     <button onClick={logout}>Logout</button>
    //     <Transact />
    //   </div>
    // </div>
  );
}

export default HomePage;
