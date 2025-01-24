import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VenueList from "../components/VenueList";
import loginBg from "../assets/images/loginpagebg2.png";
import PageTitle from "../../src/utils/PageTitle";

const StyledSection = styled.section`
  background-color: rgb(209, 209, 209);
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

const VenuePage = () => {
  return (
    <div>
      <PageTitle title="Holidaze Venues" />
      <Header />
      <StyledSection>
        <StyledH1>Venues</StyledH1>
        <VenueList />
      </StyledSection>
      <Footer />
    </div>
  );
};

export default VenuePage;
