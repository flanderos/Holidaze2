import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VenueList from "../components/VenueList";

const StyledSection = styled.section`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const StyledH1 = styled.h1`
  font-size: 30px;
  display: block;
  align-text: center;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr); /* 4 kolonner på store skjermer */
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    grid-template-columns: repeat(
      3,
      1fr
    ); /* 3 kolonner på mellomstore skjermer */
  }

  @media (min-width: 768px) and (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr); /* 2 kolonner på mindre skjermer */
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(
      1,
      1fr
    ); /* 1 kolonne på de minste skjermene */
  }
`;

const VenuePage = () => {
  return (
    <div>
      <Header />
      <StyledSection>
        <StyledH1>Venues</StyledH1>
        <CardGrid>
          <VenueList />
        </CardGrid>
      </StyledSection>
      <Footer />
    </div>
  );
};

export default VenuePage;
