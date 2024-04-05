import "./styles/App.css";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Auth from "./components/Auth";
import HomePage from "./components/HomePage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a51417",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ConfigProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} exact />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </AuthProvider>
        </ConfigProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
