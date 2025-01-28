import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  color: white;
`;

const StyledDiv = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 5px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledQuote = styled.blockquote`
  font-size: 16px;
  font-weight: 200;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    gap: 0px;
  
`;

const StyledLink = styled(Link)`
  color: black;
  font-weight: 600;
  background-color: var(--color-primary);
  text-decoration: none;
  padding: 5px;
  transition: 0.3s;
  border-radius: 16px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: black;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }
`;

const Reviews = () => {
  return (
    <StyledContainer>
      <StyledDiv>
        <h1>About this site</h1>
        <StyledQuote>
          This website is designed to provide a simple, user-friendly, and
          efficient platform that allows users to rent a venue, or become a
          venue manager and list their venues. It primarily targets is young
          adults. The developer has made an effort to make the site intuitive
          enough to be used by anyone, even first-time visitors. This is
          delivered as a project exam in the course Front End Development at
          Noroff School og digital media
          <h4>Key features</h4>
          <li>Register as a user, or as a Venue manager</li>
          <li>See a list of venues</li>
          <li>Book a venue</li>
          <li>List your own venues</li>
          <h4>Technical</h4>
          <p>
            This site is build with React and styled with Styled Components. It
            fetches data from the Noroff API and displays the data nice and tidy
            in the venue page and profile page.
          </p>
        </StyledQuote>
        <p>Anders Hellerud, Front end Developer</p>
        <StyledBox>
          <StyledLink to="/login">Log In</StyledLink>
          <p>or</p>
          <StyledLink to="/register">Create a user</StyledLink>
        </StyledBox>
      </StyledDiv>
    </StyledContainer>
  );
};

export default Reviews;
