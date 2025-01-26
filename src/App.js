import React from "react";
import "./App.css";
import { Fonts } from "./styles/Fonts";
import { Colors } from "./styles/Colors";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VenuePage from "./pages/VenuesPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Fonts />
          <Colors />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/venues" element={<VenuePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
