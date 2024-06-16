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

const theme = createTheme({
  palette: {
    primary: {
      main: "#a51417",
    },
    text: {
      primary: "#111827",
    },
    mode: "light",
  },
});

function App() {
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
                    <PrivateRoute>
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
            </Routes>
          </AuthProvider>
        </ConfigProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
