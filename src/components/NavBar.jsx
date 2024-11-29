import React from "react";
import styled from "styled-components";

const StyledNavBar = styled.nav`
  display: flex;
  justify-content: center;
`;

const StyledList = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 60px;
`;

const StyledLink = styled.li`
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
        <StyledLink>Home</StyledLink>
        <StyledLink>Venues</StyledLink>
        <StyledLink>Bookings</StyledLink>
        <StyledLink>Log in</StyledLink>
      </StyledList>
    </StyledNavBar>
  );
};

export default NavBar;
