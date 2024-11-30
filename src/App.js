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
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <div>
      <Router>
        <Fonts />
        <Colors />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
