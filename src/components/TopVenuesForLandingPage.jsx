import React from "react";
import styled from "styled-components";
import placeholder1 from "../assets/images/placeholder1.png";
import placeholder2 from "../assets/images/placeholder2.png";
import placeholder3 from "../assets/images/placeholder3.png";

const StyledContainer = styled.section`
  margin-top: 100px;
  margin-left: 10px;
  margin-right: 10px;
`;

const StyledParagraph = styled.p`
  width: 60%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TopVenues = () => {
  return (
    <StyledContainer>
      <h1>Top Venues</h1>
      <StyledParagraph>
        Here are the top 3 venues to rent for your event, because nothing says
        'I planned this last minute' quite like booking a giant space and hoping
        people show up.
      </StyledParagraph>
      <GridContainer>
        <StyledImage src={placeholder1} alt="Top Venue 1" />
        <StyledImage src={placeholder2} alt="Top Venue 2" />
        <StyledImage src={placeholder3} alt="Top Venue 3" />
      </GridContainer>
    </StyledContainer>
  );
};

export default TopVenues;
