import React from "react";
import styled from "styled-components";
import { StyledLink } from "../components/globalcomponents/StyledLink";
import placeholder1 from "../assets/images/placeholder1.png";
import placeholder2 from "../assets/images/placeholder2.png";
import placeholder3 from "../assets/images/placeholder3.png";

const StyledContainer = styled.section`
  padding: 20px;
  background-color: #fff;
`;

/* const StyledParagraph = styled.p`
  display: flex;

  @media (max-width: 768px) {

  }
}
`; */

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
      <p>Here are the top 3 venues to rent for your event.</p>
      <GridContainer>
        <StyledImage src={placeholder1} alt="Top Venue 1" />
        <StyledImage src={placeholder2} alt="Top Venue 2" />
        <StyledImage src={placeholder3} alt="Top Venue 3" />
      </GridContainer>
      <StyledLink to={"/venues"} bgColor="#E0E0E0" color="black">
        See our venues
      </StyledLink>
    </StyledContainer>
  );
};

export default TopVenues;
