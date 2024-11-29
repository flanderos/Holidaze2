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

const App = () => {
  return (
    <div>
      <Fonts />
      <div className="App">
        <Colors />
        <Header title="Holidaze" />
        <HeroSection />
      </div>
    </div>
  );
};

export default App;
