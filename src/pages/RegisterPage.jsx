import React, { useState } from "react";
import Header from "../components/Header";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/loginpagebg2.png";
import PageTitle from "../../src/utils/PageTitle";

const StyledContainer = styled.div`
  background-color: #fff;
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
  position: sticky;
`;

const StyledForm = styled.form`
  background-color: transparent;
  backdrop-filter: blur(10px);
  color: #fff;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 40px;
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 10px;
  }
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
  margin: 10px;
  outline: none;
  font-size: 17px;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  margin: 10px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  padding: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  border: 2px solid #ffd446;
  border-radius: 4px;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  &:checked {
    background-color: #ffd446;
    border-color: #ffd446;
  }

  &:checked::before {
    content: "✔";
    display: block;
    color: black;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
  }

  &:hover {
    border-color: #ffd446;
  }
`;

const StyledCheckboxLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s ease;
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
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "username" && !/^[a-zA-Z0-9_]+$/.test(value.trim())) {
      newErrors.username =
        "Name can only contain letters, numbers, and underscores.";
    } else {
      delete newErrors.username;
    }

    if (
      name === "email" &&
      !/^[a-zA-Z0-9._%+-]+@(stud\.noroff\.no|noroff\.no)$/.test(value.trim())
    ) {
      newErrors.email =
        "Email must be a valid stud.noroff.no or noroff.no email address.";
    } else {
      delete newErrors.email;
    }

    if (name === "password" && value.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else {
      delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const requestData = {
      name: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      bio: form.bio.value.trim() || "",
      avatar: {
        url: form.avatarUrl.value.trim() || "https://i.pravatar.cc/300",
        alt: "avatar",
      },
      banner: {
        url: form.bannerUrl.value.trim() || "https://i.pravatar.cc/300",
        alt: "banner",
      },
      venueManager: form.venueManager.checked,
    };

    const newErrors = {};
    if (!/^[a-zA-Z0-9_]+$/.test(requestData.name)) {
      newErrors.username =
        "Name can only contain letters, numbers, and underscores.";
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@(stud\.noroff\.no|noroff\.no)$/.test(
        requestData.email,
      )
    ) {
      newErrors.email =
        "Email must be a valid stud.noroff.no or noroff.no email address.";
    }

    if (requestData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.log(errorData);

        const errorMessages = errorData.errors
          .map((error) => error.message)
          .join("\n");

        alert(`Registration failed:\n${errorMessages}`);

        return;
      }

      alert("Registration successful!");
      form.reset();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <>
      <Header title="Holidaze" />
      <PageTitle title="Holidaze Register" />
      <StyledContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledH1>Register User</StyledH1>
          <StyledLabel htmlFor="username">Username</StyledLabel>
          <StyledInput
            type="text"
            id="username"
            name="username"
            placeholder="enter your username here..."
            isInvalid={!!errors.username}
            onChange={handleInputChange}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

          <StyledLabel htmlFor="email">
            Email (Required to be @STUD.NOROFF.NO))
          </StyledLabel>
          <StyledInput
            type="email"
            id="email"
            name="email"
            placeholder="enter your email here... @stud.noroff.no or noroff.no"
            isInvalid={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <StyledLabel htmlFor="password">Password (Required)</StyledLabel>
          <StyledInput
            type="password"
            id="password"
            name="password"
            placeholder="enter your password here..."
            isInvalid={!!errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          <StyledLabel htmlFor="bio">Bio (Optional)</StyledLabel>
          <StyledTextarea id="bio" name="bio" rows="4" />

          <StyledLabel htmlFor="avatarUrl">
            Avatar URL(Has to be a URL){" "}
          </StyledLabel>
          <StyledInput type="url" id="avatarUrl" name="avatarUrl" />

          <StyledLabel htmlFor="bannerUrl">Banner URL</StyledLabel>
          <StyledInput type="url" id="bannerUrl" name="bannerUrl" />

          <StyledLabel>
            <CheckboxContainer>
              <StyledCheckbox
                type="checkbox"
                id="venueManager"
                name="venueManager"
              />
              <StyledCheckboxLabel htmlFor="venueManager">
                Are you a Venue Manager?
              </StyledCheckboxLabel>
            </CheckboxContainer>
          </StyledLabel>

          <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
      </StyledContainer>
    </>
  );
};

export default RegisterPage;
