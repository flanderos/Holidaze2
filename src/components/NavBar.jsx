import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";

const StyledNavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const StyledList = styled.ul`
  list-style-type: none;
  display: flex;
  gap: 60px;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: fixed;
    margin-top: 175px;
    top: 0;
    right: 0;
    width: 100%;
    background-color: var(--color-primary);
    padding: 20px;
    border-radius: 5px;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.3s ease-in-out;
    z-index: 2;
  }
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 5px;
  transition: 0.3s;
  border-radius: 5px;

  &:hover {
    color: white;
    background-color: ${(props) =>
      props.isLogout ? "red" : "var(--color-black)"};
  }
`;

const Hamburger = styled.div`
  position: fixed;
  right: 35px;
  top: 20px;
  background-color: var(--color-primary);
  padding: 10px;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 3;
  border-radius: 10px;

  span {
    width: 25px;
    height: 3px;
    background-color: black;
    margin: 4px 0;
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    display: flex;
    right: 50px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1;
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
`;

const NavBar = () => {
  const { isLoggedIn, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <StyledNavBar>
        <Hamburger onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </Hamburger>
        <StyledList open={menuOpen}>
          <StyledLink to="/">
            Home <FontAwesomeIcon icon={faHome} />
          </StyledLink>
          <StyledLink to="/venues">
            Venues
            <FontAwesomeIcon icon={faStar} />
          </StyledLink>
          {isLoggedIn && (
            <StyledLink to="/profile">
              Profile <FontAwesomeIcon icon={faUser} />
            </StyledLink>
          )}
          {isLoggedIn ? (
            <StyledLink onClick={logOut} isLogout>
              Log Out <FontAwesomeIcon icon={faPersonWalkingArrowRight} />
            </StyledLink>
          ) : (
            <StyledLink to="/login">Log In</StyledLink>
          )}
          <StyledLink to="/register" hidden={isLoggedIn}>
            Register
          </StyledLink>
        </StyledList>
      </StyledNavBar>
      <Backdrop open={menuOpen} onClick={() => setMenuOpen(false)} />
    </>
  );
};

export default NavBar;
