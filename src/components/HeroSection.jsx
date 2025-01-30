import React from "react";
import styled from "styled-components";
import HeroImage from "../assets/images/landingpageimage.webp";
import { StyledLink } from "./globalcomponents/StyledLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const StyledHeroImage = styled.section`
  margin: 0 auto;
  box-sizing: border-box;
  background-image: url(${HeroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 600px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 400px;
  }

  @media (max-width: 480px) {
    height: 300px;
  }
`;

const TextContainer = styled.div`
  max-width: 600px;
  padding: 20px;
  color: #fff;
  font-weight: 300;
  background: rgba(0, 0, 0, 0.5); /* Litt mørk bakgrunn for bedre lesbarhet */
  border-radius: 10px;
  font-size: 16px;

  @media (max-width: 768px) {
    max-width: 80%;
    padding: 15px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 10px;
    font-size: 12px;
  }
`;

const StyledH1 = styled.h1`
  font-size: 35px;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const HeroSection = () => {
  return (
    <StyledHeroImage>
      <TextContainer>
        <StyledH1>Your Journey Starts Here</StyledH1>
        <p>
          "Welcome to Holidaze – Your Platform for venues!" At Holidaze, you can
          effortlessly browse and book amazing venues, whether you're planning a
          relaxing getaway, a weekend trip, or an unforgettable adventure.
        </p>
        <StyledLink to="/venues" bgColor="#FFD446" color="black">
          See our venues
          <FontAwesomeIcon icon={faArrowRight} />
        </StyledLink>
      </TextContainer>
    </StyledHeroImage>
  );
};

export default HeroSection;
