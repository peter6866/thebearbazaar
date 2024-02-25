import "./styles/App.css";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Transact from "./components/Transact";
import HomePage from "./components/HomePage";
import Faq from "./components/Faq";

function App() {
  return (
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
  );
}

export default App;
