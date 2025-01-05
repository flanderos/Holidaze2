import React from "react";
import styled from "styled-components";
import HeroImage from "../assets/images/landingpageimage.png";
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
`;

const TextContainer = styled.div`
  color: #fff;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 25px;

  @media (max-width: 744px) {
    padding: 10px;
    align-items: center;
  }
`;

const StyledH1 = styled.h1`
  font-size: 35px;
  margin: 0;
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
            <FontAwesomeIcon icon={faArrowRight} />
          </StyledLink>
        </TextContainer>
      </StyledHeroImage>
    </div>
  );
};

export default HeroSection;
