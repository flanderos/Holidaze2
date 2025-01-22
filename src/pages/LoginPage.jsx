import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import loginBg from "../assets/images/loginpagebg2.png";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-image: url(${loginBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
`;

const StyledForm = styled.form`
  background-color: transparent;
  backdrop-filter: blur(10px);
  color: #fff;
  height: 500px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  border-radius: 10px;
`;

const StyledH1 = styled.h1`
  text-align: center;
  text-decoration: underline;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  padding: 10px;
  margin: 10px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  padding: 5px;
`;

const StyledButton = styled.button`
  padding: 10px;
  color: black;
  background-color: var(--color-primary);
  border: none;
  border-radius: 5px;
  font-size: 20px;
  font-family: poppins;
  cursor: pointer;
  width: 97%;
  margin: 30px 0px 10px 10px;
  transition: 0.3s;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    text-decoration: underline;
  }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

const StyledLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  padding: 5px;
  transition: 0.3s;
  border-radius: 5px;

  &:hover {
    text-decoration: underline;
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
    if (!/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(requestData.email)) {
      newErrors.email = "Email must be a valid stud.noroff.no email address.";
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
        console.error("API Response Error:", errorResponse);
        throw new Error("Failed to log in. Please try again.");
      }

      const responseData = await response.json();
      console.log("Login successful:", responseData.data);

      logIn(responseData.data.accessToken, responseData.data);

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
    <div>
      <Header />
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
