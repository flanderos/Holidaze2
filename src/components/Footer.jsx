import React from "react";
import styled from "styled-components";
import NavBar from "./NavBar";

const StyledContainer = styled.section`
  background-color: var(--color-primary);
  color: black;
  display: flex;
  flex-direction: column;
`;
const StyledDiv = styled.div`
  display:;
`;
const StyledH1 = styled.h1`
  font-size: 100px;
  text-align: center;
`;

const FooterNavBar = styled(NavBar)`
  justify-content: flex-end;
`;

const Footer = () => {
  return (
    <StyledContainer>
      <StyledDiv>
        <StyledH1>Holidaze</StyledH1>
      </StyledDiv>
      <FooterNavBar />
    </StyledContainer>
  );
};

export default Footer;
