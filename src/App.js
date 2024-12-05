import React from "react";
import "./App.css";
import Header from "./components/Header";
import { Fonts } from "./styles/Fonts";
import { Colors } from "./styles/Colors";
import HeroSection from "./components/HeroSection";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VenuePage from "./pages/VenuesPage";

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
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
