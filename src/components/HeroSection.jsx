import React from "react";
import styled from "styled-components";
import HeroImage from "../assets/images/landingpageimage.png";
import { Link } from "react-router-dom";
import { StyledLink } from "./globalcomponents/StyledLink";

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
  justify-content: flex-end;
  align-items: center;
`;

const TextContainer = styled.div`
  color: #fff;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 50px;

  @media (max-width: 744px) {
    padding: 10px;
    align-items: center;
  }
`;

const StyledH1 = styled.h1`
  font-size: 35px;
  margin: 0;
`;

const StyledCtaButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  padding: 10px 20px 10px 20px;
  background-color: #fff;
  color: black;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid white;
  font-family: "Michroma", sans-serif;
  transition: 0.6s;

  &:hover {
    cursor: pointer;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 13px 0px;
  }
`;

const HeroSection = () => {
  return (
    <div>
      <StyledHeroImage>
        <TextContainer>
          <StyledH1>Your Journey Starts Here</StyledH1>
          <p>
            Renting an arena for an event is like buying a mansion for a
            sleepover—way too big, but hey, at least there’s space for the
            pizza.
          </p>
          <StyledLink to="/venues" bgColor="white" color="black">
            See our venues
          </StyledLink>
        </TextContainer>
      </StyledHeroImage>
    </div>
  );
};

export default HeroSection;
