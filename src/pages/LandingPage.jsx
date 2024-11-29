import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TopVenues from "../components/TopVenuesForLandingPage";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div>
      <Header title="Holidaze" />
      <HeroSection />
      <TopVenues />
      <Reviews />
      <Footer />
    </div>
  );
};

export default LandingPage;
