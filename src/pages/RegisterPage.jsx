import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styled from "styled-components";

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
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-size: 16px;
  font-family: michroma;
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-size: 16px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  padding: 5px;
`;

const StyledButton = styled.button`
  padding: 10px;
  background-color: var(--color-green, blue);
  color: black;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: 0.3s;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    background-color: var(--color-grey, darkblue);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

const RegisterPage = () => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const bio = form.bio.value.trim();
    const avatarUrl = form.avatarUrl?.value.trim();
    const bannerUrl = form.bannerUrl?.value.trim();
    const isVenueManager = form.venuemananger.checked;

    const newErrors = {};

    // Name validation
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      newErrors.username =
        "Name can only contain letters, numbers, and underscores (_).";
    }

    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(email)) {
      newErrors.email = "Email must be a valid stud.noroff.no email address.";
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // Bio validation
    if (bio && bio.length > 160) {
      newErrors.bio = "Bio must be less than 160 characters.";
    }

    // Avatar URL validation
    if (avatarUrl && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(avatarUrl)) {
      newErrors.avatarUrl = "Avatar URL must be valid and accessible.";
    }

    // Banner URL validation
    if (bannerUrl && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(bannerUrl)) {
      newErrors.bannerUrl = "Banner URL must be valid and accessible.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      return;
    }
  };

  return (
    <div>
      <Header title="Holidaze" />
      <StyledContainer>
        <h1>Register User</h1>
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel htmlFor="username">Username (Required)</StyledLabel>
          <StyledInput
            type="text"
            id="username"
            name="username"
            isInvalid={!!errors.username}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

          <StyledLabel htmlFor="email">Email (Required)</StyledLabel>
          <StyledInput
            type="email"
            id="email"
            name="email"
            isInvalid={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <StyledLabel htmlFor="password">Password (Required)</StyledLabel>
          <StyledInput
            type="password"
            id="password"
            name="password"
            isInvalid={!!errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          <StyledLabel htmlFor="bio">Bio (Optional)</StyledLabel>
          <StyledTextarea
            id="bio"
            name="bio"
            rows="4"
            placeholder="Tell us about yourself..."
            isInvalid={!!errors.bio}
          />
          {errors.bio && <ErrorMessage>{errors.bio}</ErrorMessage>}

          <StyledLabel htmlFor="avatarUrl">Avatar URL</StyledLabel>
          <StyledInput
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            isInvalid={!!errors.avatarUrl}
          />
          {errors.avatarUrl && <ErrorMessage>{errors.avatarUrl}</ErrorMessage>}

          <StyledLabel htmlFor="bannerUrl">Banner URL</StyledLabel>
          <StyledInput
            type="url"
            id="bannerUrl"
            name="bannerUrl"
            isInvalid={!!errors.bannerUrl}
          />
          {errors.bannerUrl && <ErrorMessage>{errors.bannerUrl}</ErrorMessage>}

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
