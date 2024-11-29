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
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <div>
      <Fonts />
      <Colors />
      <LandingPage />
    </div>
  );
};

export default App;
