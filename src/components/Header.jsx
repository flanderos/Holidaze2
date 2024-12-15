import React from "react";
import NavBar from "./NavBar";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { getUserNameFromLocalStorage } from "../api/FetchUserName";

const StyledHeader = styled.header`
  background-color: var(--color-primary);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 13px 0px;
  padding: 10px 20px;

  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const StyledH1 = styled.h1`
  font-family: "Michroma";
`;

const StyledSubtitle = styled.h2`
  font-size: 20px;
  font-family: "Edu AU VIC WA NT Hand";
  font-weight: 400;
`;

const StyledGreeting = styled.h3`
  font-size: 15px;
  color: #fff;
`;

const Header = () => {
  const userName = getUserNameFromLocalStorage();

  return (
    <StyledHeader>
      <Container>
        <StyledH1>Holidaze</StyledH1>
        <StyledSubtitle>Your Journey Starts Here</StyledSubtitle>
        <StyledGreeting>Hello! {userName}</StyledGreeting>
      </Container>
      <NavBar />
    </StyledHeader>
  );
};

export default Header;
