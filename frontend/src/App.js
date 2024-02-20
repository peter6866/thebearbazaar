import "./App.css";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
