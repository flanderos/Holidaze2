import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const requestData = {
      name: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      ...(form.bio.value.trim() && { bio: form.bio.value.trim() }),
      ...(form.avatarUrl.value.trim() && {
        avatar: {
          url: form.avatarUrl.value.trim(),
          alt: "useravatar",
        },
      }),
      ...(form.bannerUrl.value.trim() && {
        banner: {
          url: form.bannerUrl.value.trim(),
          alt: "userbanner",
        },
      }),
      venueManager: form.venuemananger.checked,
    };

    navigate("/");

    const newErrors = {};

    if (!/^[a-zA-Z0-9_]+$/.test(requestData.name)) {
      newErrors.username =
        "Name can only contain letters, numbers, and underscores (_).";
    }

    if (!/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(requestData.email)) {
      newErrors.email = "Email must be a valid stud.noroff.no email address.";
    }

    if (requestData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const API_URL = "https://v2.api.noroff.dev";
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Response Error:", errorResponse);
        throw new Error("Failed to register. Please try again.");
      }

      const responseData = await response.json();
      console.log("Registration successful:", responseData);

      localStorage.setItem("isLoggedIn", "true");

      alert("Registration successful!");
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering. Please try again.");
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
          />

          <StyledLabel htmlFor="avatarUrl">Avatar URL</StyledLabel>
          <StyledInput type="url" id="avatarUrl" name="avatarUrl" />

          <StyledLabel htmlFor="bannerUrl">Banner URL</StyledLabel>
          <StyledInput type="url" id="bannerUrl" name="bannerUrl" />

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
