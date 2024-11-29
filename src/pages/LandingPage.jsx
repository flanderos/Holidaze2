import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TopVenues from "../components/TopVenuesForLandingPage";
import Reviews from "../components/Reviews";

const LandingPage = () => {
  return (
    <div>
      <Header title="Holidaze" />
      <HeroSection />
      <TopVenues />
      <Reviews />
    </div>
  );
};

export default LandingPage;
