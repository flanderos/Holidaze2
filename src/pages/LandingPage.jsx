import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TopVenues from "../components/TopVenuesForLandingPage";

const LandingPage = () => {
  return (
    <div>
      <Header title="Holidaze" />
      <HeroSection />
      <TopVenues />
    </div>
  );
};

export default LandingPage;
