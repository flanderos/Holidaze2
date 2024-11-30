import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNavBar = styled.nav`
  display: flex;
  justify-content: center;
`;

const StyledList = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 60px;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 5px;
  transition: 0.3s;
  border-radius: 5px;

  &:hover {
    color: var(--color-primary);
    background-color: var(--color-black);
  }
`;

const NavBar = () => {
  return (
    <StyledNavBar>
      <StyledList>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/venues">Venues</StyledLink>
        <StyledLink to="/bookings">Bookings</StyledLink>
        <StyledLink to="/register">Login</StyledLink>
      </StyledList>
    </StyledNavBar>
  );
};

export default NavBar;
