import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useDispatch } from "react-redux";
import { fetchInitialData } from "./features/bidSlice";
import axios from "axios";

const PrivateRoute = ({ children, adminPage = false }) => {
  const {
    isLoggedIn,
    isLoading: authLoading,
    authToken,
    role,
    logout,
  } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      if (isLoggedIn && !authLoading) {
        try {
          await axios.get(
            `${import.meta.env.VITE_API_URL}/v1/users/auth/status`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          // Token is valid, fetch initial data
          dispatch(fetchInitialData({ authToken }));
        } catch (error) {
          // Token is invalid, call logout
          logout();
        }
      }
    };

    checkToken();
  }, [isLoggedIn, authLoading, authToken, dispatch, logout]);

  if (authLoading) {
    return null; // Render nothing while loading
  }

  if (!isLoggedIn) {
    // Redirect to landing page, but store original location for later
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  if (adminPage && role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
