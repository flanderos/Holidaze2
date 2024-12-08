import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    if (!/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(requestData.email)) {
      newErrors.email = "Email must be a valid stud.noroff.no email address.";
    }

    //password validation

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
        console.error("API Response Error:", errorResponse);
        throw new Error("Failed to log in. Please try again.");
      }

      const responseData = await response.json();
      console.log("Login successful:", responseData);

      logIn();
      form.reset();
      setErrors({});
      setApiError("");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setApiError("Failed to log in. Please try again.");
    }
  };

  return (
    <StyledContainer>
      <h1>Log In</h1>
      <StyledForm onSubmit={handleSubmit}>
        {apiError && <ErrorMessage>{apiError}</ErrorMessage>}{" "}
        {/* Viser API-feilmeldinger */}
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
        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </StyledContainer>
  );
};

export default LoginForm;
