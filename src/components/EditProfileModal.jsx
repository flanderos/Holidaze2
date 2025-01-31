import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 1000;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: sticky;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ModalForm = styled.form`
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

const ModalInput = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  padding: 10px;
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

const ModalTextArea = styled.textarea`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  padding: 10px;
  margin: 10px;
  outline: none;
  resize: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const ModalSubmitButton = styled.button`
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

const EditProfileModal = ({ isOpen, onClose, profileData, onUpdate }) => {
  const [updatedProfile, setUpdatedProfile] = useState({
    avatar: "",
    bio: "",
    profilePicture: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profileData) {
      setUpdatedProfile({
        avatar: profileData.avatar || "",
        bio: profileData.bio || "",
        profilePicture: profileData.profilePicture || "",
      });
    }
  }, [profileData]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found");
      setIsSubmitting(false);
      return;
    }

    try {
      const body = {};

      if (updatedProfile.avatar) {
        body.avatar = {
          url: updatedProfile.avatar,
          alt: `${profileData.name}'s avatar`,
        };
      }

      if (updatedProfile.banner) {
        body.banner = {
          url: updatedProfile.banner,
          alt: `${profileData.name}'s banner`,
        };
      }

      if (updatedProfile.bio) {
        body.bio = updatedProfile.bio;
      }

      const response = await fetch(`${API_URL}/profiles/${profileData.name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const updatedData = await response.json();
      onUpdate({
        ...profileData,
        avatar: updatedData.data.avatar?.url || profileData.avatar,
        banner: updatedData.data.banner?.url || profileData.banner,
        bio: updatedData.data.bio || profileData.bio,
      });
      onClose();
    } catch (error) {
      setError(error.message);
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <CloseButton onClick={onClose} aria-label="Close modal">
          &times;
        </CloseButton>
        <h2>Edit Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <ModalForm onSubmit={handleEditProfile}>
          <label htmlFor="avatar">Avatar URL:</label>
          <ModalInput
            type="url"
            id="avatar"
            value={updatedProfile.avatar}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, avatar: e.target.value })
            }
            disabled={isSubmitting}
          />

          <label htmlFor="banner">Banner URL:</label>
          <ModalInput
            type="url"
            id="banner"
            value={updatedProfile.banner}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, banner: e.target.value })
            }
            disabled={isSubmitting}
          />

          <label htmlFor="bio">About:</label>
          <ModalTextArea
            id="bio"
            rows="4"
            value={updatedProfile.bio}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, bio: e.target.value })
            }
            disabled={isSubmitting}
          />

          <ModalSubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </ModalSubmitButton>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profileData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    profilePicture: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditProfileModal;
