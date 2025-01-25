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
  width: 50%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 40px;
  border-radius: 10px;

    @media (max-width: 1080px) {
  
    width: 90%;
  }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const requestData = {
      name: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      ...(form.bio.value.trim() && { bio: form.bio.value.trim() }),
      ...(form.avatarUrl.value.trim() && {
        avatar: { url: form.avatarUrl.value.trim(), alt: "useravatar" },
      }),
      ...(form.bannerUrl.value.trim() && {
        banner: { url: form.bannerUrl.value.trim(), alt: "userbanner" },
      }),
      venueManager: form.venueManager.checked,
    };

    const newErrors = {};
    if (!/^[a-zA-Z0-9_]+$/.test(requestData.name)) {
      newErrors.username =
        "Name can only contain letters, numbers, and underscores.";
    }

    if (!/^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(requestData.email)) {
      newErrors.email = "Email must be a valid stud.noroff.no email address.";
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

      if (!response.ok) throw new Error("Failed to register.");

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
          <StyledTextarea id="bio" name="bio" rows="4" />

          <StyledLabel htmlFor="avatarUrl">Avatar URL</StyledLabel>
          <StyledInput type="url" id="avatarUrl" name="avatarUrl" />

          <StyledLabel htmlFor="bannerUrl">Banner URL</StyledLabel>
          <StyledInput type="url" id="bannerUrl" name="bannerUrl" />

          <StyledLabel>
            <StyledInput
              type="checkbox"
              id="venueManager"
              name="venueManager"
            />
            Are you a Venue Manager?
          </StyledLabel>

          <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
      </StyledContainer>
    </>
  );
};

export default RegisterPage;
