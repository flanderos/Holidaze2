import React from "react";
import styled from "styled-components";
import NavBar from "./NavBar";

const StyledContainer = styled.section`
  background-color: var(--color-primary);
  color: black;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 200px;
  bottom: 0;
  z-index: -1;
  width: 100%;
`;
const StyledDiv = styled.div`
  display:;
`;
const StyledH1 = styled.h1`
  font-size: 3rem;
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
