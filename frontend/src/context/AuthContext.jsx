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
  const [role, setRole] = useState("");

  // Check for a token in local storage on load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setAuthToken(token);
      setRole(role);
    }
    setIsLoading(false);
  }, []);

  const login = (role, token) => {
    setIsLoggedIn(true);
    setRole(role);
    setAuthToken(token);
    // Store the token in local storage
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    // Clear the token from storage on logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
  };

  const value = {
    isLoggedIn,
    authToken,
    role,
    login,
    logout,
    isLoading,
  };

  // Check for a token in local storage on load
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
