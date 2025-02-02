import React, { useState, useCallback } from "react";
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

const VALIDATION_RULES = {
  username: {
    required: true,
    pattern: /^[a-zA-Z0-9_]+$/,
    minLength: 3,
    maxLength: 20,
    messages: {
      required: "Username is required",
      pattern: "Username can only contain letters, numbers, and underscores",
      length: "Username must be between 3 and 20 characters",
    },
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@(stud\.noroff\.no|noroff\.no)$/,
    messages: {
      required: "Email is required",
      pattern: "Email must be a valid stud.noroff.no or noroff.no address",
    },
  },
  password: {
    required: true,
    minLength: 8,
    messages: {
      required: "Password is required",
      length: "Password must be at least 8 characters",
    },
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    messages: {
      pattern: "Please enter a valid URL",
    },
  },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    avatarUrl: "",
    bannerUrl: "",
    venueManager: false,
  });

  const validateField = useCallback((name, value) => {
    const rules =
      VALIDATION_RULES[
        name === "avatarUrl" || name === "bannerUrl" ? "url" : name
      ];
    if (!rules) return "";

    const trimmedValue = value.trim();

    if (rules.required && !trimmedValue) {
      return rules.messages.required;
    }

    if (rules.pattern && trimmedValue && !rules.pattern.test(trimmedValue)) {
      return rules.messages.pattern;
    }

    if (rules.minLength && trimmedValue.length < rules.minLength) {
      return rules.messages.length;
    }

    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      return rules.messages.length;
    }

    return "";
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const inputValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: inputValue,
      }));

      if (type !== "checkbox") {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [validateField],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== "venueManager" && field !== "bio") {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const requestData = {
      name: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      bio: formData.bio.trim(),
      avatar: {
        url: formData.avatarUrl.trim() || "https://i.pravatar.cc/300",
        alt: "avatar",
      },
      banner: {
        url: formData.bannerUrl.trim() || "https://i.pravatar.cc/300",
        alt: "banner",
      },
      venueManager: formData.venueManager,
    };

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors
          ?.map((error) => error.message)
          .join("\n");
        throw new Error(errorMessage || "Registration failed");
      }

      // Success
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (err) {
      alert(err.message);
      console.error("Registration error:", err);
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
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username..."
            isInvalid={!!errors.username}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

          <StyledLabel htmlFor="email">
            Email (Required @stud.noroff.no)
          </StyledLabel>
          <StyledInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.name@stud.noroff.no"
            isInvalid={!!errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <StyledLabel htmlFor="password">Password (Required)</StyledLabel>
          <StyledInput
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Minimum 8 characters"
            isInvalid={!!errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          <StyledLabel htmlFor="bio">Bio (Optional)</StyledLabel>
          <StyledTextarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="4"
            placeholder="Tell us about yourself..."
          />

          <StyledLabel htmlFor="avatarUrl">Avatar URL (Optional)</StyledLabel>
          <StyledInput
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.jpg"
            isInvalid={!!errors.avatarUrl}
          />
          {errors.avatarUrl && <ErrorMessage>{errors.avatarUrl}</ErrorMessage>}

          <StyledLabel htmlFor="bannerUrl">Banner URL (Optional)</StyledLabel>
          <StyledInput
            type="url"
            id="bannerUrl"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/banner.jpg"
            isInvalid={!!errors.bannerUrl}
          />
          {errors.bannerUrl && <ErrorMessage>{errors.bannerUrl}</ErrorMessage>}

          <StyledLabel>
            <CheckboxContainer>
              <StyledCheckbox
                type="checkbox"
                id="venueManager"
                name="venueManager"
                checked={formData.venueManager}
                onChange={handleInputChange}
              />
              <StyledCheckboxLabel htmlFor="venueManager">
                Register as a Venue Manager
              </StyledCheckboxLabel>
            </CheckboxContainer>
          </StyledLabel>

          <StyledButton type="submit">
            <span>Create Account</span>
          </StyledButton>
        </StyledForm>
      </StyledContainer>
    </>
  );
};

export default RegisterPage;
