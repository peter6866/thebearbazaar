// This is the context file for the authentication state. It provides the login, logout, and auth token state to the rest of the app.
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for a token in local storage on load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      setAuthToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    setIsLoggedIn(true);
    setAuthToken(token);
    // Store the token in local storage
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    // Clear the token from storage on logout
    localStorage.removeItem("authToken");
  };

  const value = {
    isLoggedIn,
    authToken,
    login,
    logout,
    isLoading,
  };

  // Check for a token in local storage on load
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
