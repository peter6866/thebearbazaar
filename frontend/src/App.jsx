import "./styles/App.css";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Auth from "./pages/AuthPage/Auth";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/DashboardPage/Dashboard";
import BidPage from "./pages/MyBidPage/BidPage";
import Faq from "./pages/FAQPage/Faq";
import AdminPage from "./pages/AdminPage/AdminPage";
import Profile from "./pages/ProfilePage/Profile";
import PrivateRoute from "./PrivateRoute";
import { useTheme, ToggleThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage/LandingPage";

function AppContent() {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a51417",
      },
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ConfigProvider>
          <AuthProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                  exact
                />
                <Route
                  path="/mybid"
                  element={
                    <PrivateRoute>
                      <BidPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <PrivateRoute>
                      <Faq />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminPage={true}>
                      <AdminPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route path="/home" element={<LandingPage />} />
            </Routes>
          </AuthProvider>
        </ConfigProvider>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ToggleThemeProvider>
      <AppContent />
    </ToggleThemeProvider>
  );
}

export default App;
