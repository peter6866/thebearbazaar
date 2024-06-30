import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useConfig } from "./context/ConfigContext";
import { useDispatch } from "react-redux";
import { fetchInitialData } from "./features/bidSlice";

const PrivateRoute = ({ children, adminPage = false }) => {
  const { config, loading } = useConfig();
  const { isLoggedIn, isLoading, authToken, role } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && !isLoading && !loading) {
      dispatch(fetchInitialData({ authToken, config }));
    }
  }, [isLoggedIn, isLoading, dispatch, authToken, config, loading]);

  if (!isLoggedIn && !isLoading && !loading) {
    // Redirect to auth, but store original location for later
    return <Navigate to="/auth" state={{ from: location }} replace />;
  } else if (isLoggedIn && adminPage && role !== "admin" && !loading) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
