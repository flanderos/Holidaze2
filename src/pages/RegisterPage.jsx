import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TopVenues from "../components/TopVenuesForLandingPage";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import styled from "styled-components";

//Username (Required)
//Email (Required)
//Password  (Required)
//Bio (Optional)
//Avatar
//Banner
//Venuemanger true or false

const StyledContainer = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  border-radius: 10px;
`;
const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

const StyledButton = styled.button`
  padding: 10px;
  background-color: var(--color-primary, blue);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-dark, darkblue);
  }
`;
//Username (Required)
//Email (Required)
//Password  (Required)
//Bio (Optional)
//Avatar
//Banner
//Venuemanger true or false

const RegisterPage = () => {
  return (
    <div>
      <Header title="Holidaze" />
      <StyledContainer>
        <h1>Register User</h1>
        <StyledForm>
          <StyledLabel htmlFor="username">Username (Required)</StyledLabel>
          <StyledInput type="text" id="username" name="username" required />

          <StyledLabel htmlFor="email">Email (Required)</StyledLabel>
          <StyledInput type="email" id="email" name="email" required />

          <StyledLabel htmlFor="password">Password (Required)</StyledLabel>
          <StyledInput type="password" id="password" name="password" required />

          <StyledLabel htmlFor="bio">Bio (Optional)</StyledLabel>
          <StyledTextarea
            id="bio"
            name="bio"
            rows="4"
            placeholder="Tell us about yourself..."
          />

          <StyledLabel htmlFor="avatar">Avatar</StyledLabel>
          <StyledInput type="file" id="avatar" name="avatar" />

          <StyledLabel htmlFor="banner">Banner</StyledLabel>
          <StyledInput type="file" id="banner" name="banner" />

          <StyledLabel>
            <StyledInput
              type="checkbox"
              id="venuemananger"
              name="venuemananger"
            />
            Are you a Venue Manager?
          </StyledLabel>

          <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
      </StyledContainer>
      <Footer />
    </div>
  );
};

export default RegisterPage;
