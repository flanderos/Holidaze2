import React, { useState } from "react";
import Header from "../components/Header";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/loginpagebg2.png";
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
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
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
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: var(--color-primary);
    border-radius: 2px;
  }
`;

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
  margin: 0;

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

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
  min-height: 120px;
  margin: 0;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: -15px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const StyledCheckbox = styled.input`
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.1);

  &:checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  &:checked::before {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    font-size: 14px;
    font-weight: bold;
  }

  &:hover {
    border-color: var(--color-primary);
  }
`;

const StyledCheckboxLabel = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary);
  }
`;

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
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    background: white;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::before {
    top: 0;
    left: -100%;
  }

  &::after {
    bottom: 0;
    right: -100%;
  }

  & > span {
    position: relative;
    z-index: 2;

    &::before,
    &::after {
      content: "";
      position: absolute;
      height: 100%;
      width: 2px;
      background: white;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
      top: -100%;
      left: 0;
    }

    &::after {
      bottom: -100%;
      right: 0;
    }
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
      left: 0;
    }

    &::after {
      opacity: 1;
      right: 0;
    }

    & > span::before {
      opacity: 1;
      top: 0;
    }

    & > span::after {
      opacity: 1;
      bottom: 0;
    }
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
