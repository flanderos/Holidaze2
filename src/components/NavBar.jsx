import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importer useAuth

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
  display: ${(props) => (props.hidden ? "none" : "block")};

  &:hover {
    color: var(--color-primary);
    &:hover {
    background-color: ${(props) => (props.isLogout ? "red" : "var(--color-black)")};
  }
`;

const NavBar = () => {
  const { isLoggedIn, logOut } = useAuth();

  return (
    <StyledNavBar>
      <StyledList>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/venues">Venues</StyledLink>
        <StyledLink to="/bookings">Bookings</StyledLink>
        {isLoggedIn ? (
          <StyledLink onClick={logOut} isLogout>
            Log Out
          </StyledLink>
        ) : (
          <StyledLink to="/login">Log In</StyledLink>
        )}
        <StyledLink to="/register" hidden={isLoggedIn}>
          Register{" "}
        </StyledLink>
      </StyledList>
    </StyledNavBar>
  );
};

export default NavBar;
