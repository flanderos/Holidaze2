import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginBg from "../assets/images/loginpagebg2.png";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import PageTitle from "../../src/utils/PageTitle";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-image: url(${loginBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
    pointer-events: none;
  }
`;

const StyledForm = styled.form`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  color: #fff;
  min-height: 500px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    padding: 30px;
    width: 90%;
  }
`;

const StyledH1 = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: var(--color-primary);
    border-radius: 2px;
}}`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid
    ${(props) => (props.isInvalid ? "#ff4d4f" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
  outline: none;
  font-family: poppins;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.1) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: -15px;
\`;`;

const StyledButton = styled.button`
  width: 100%;
  padding: 14px;
  background: var(--color-primary);
  color: black;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 14px;
  margin-top: -15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "⚠";
    font-size: 16px;
  }
`;

const StyledLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: none;
    opacity: 0.8;
  }
`;

const LoginForm = () => {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const requestData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    const newErrors = {};

    // Email-regex and validation
    if (
      !/^[a-zA-Z0-9._%+-]+@(stud\.noroff\.no|noroff\.no)$/.test(
        requestData.email,
      )
    ) {
      newErrors.email =
        "Email must be a valid stud.noroff.no or noroff.no email address.";
    }

    // Password validation
    if (requestData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const API_URL = "https://v2.api.noroff.dev";
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();

        alert(errorResponse.errors[0].message);
        throw new Error(errorResponse.errors[0]);
      }

      const responseData = await response.json();

      logIn(responseData.data.accessToken, responseData.data);

      form.reset();
      setErrors({});
      setApiError("");
      navigate("/");
    } catch (error) {
      setApiError("Failed to log in. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <PageTitle title="Holidaze Log in" />
      <StyledContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledH1>Log In</StyledH1>
          {apiError && <ErrorMessage>{apiError}</ErrorMessage>}{" "}
          {/* Errormsg from the API */}
          <StyledLabel htmlFor="email">Email (Required)</StyledLabel>
          <StyledInput
            type="email"
            id="email"
            name="email"
            isInvalid={!!errors.email}
            placeholder="Enter your email here"
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          <StyledLabel htmlFor="password">Password (Required)</StyledLabel>
          <StyledInput
            type="password"
            id="password"
            name="password"
            isInvalid={!!errors.password}
            placeholder="Enter your password here"
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          <StyledButton type="submit">Log in</StyledButton>
          <p>
            Not yet a user? <StyledLink to="/register">Register</StyledLink>
          </p>
        </StyledForm>
      </StyledContainer>
    </div>
  );
};

export default LoginForm;
