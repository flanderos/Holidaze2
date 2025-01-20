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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  z-index: 1001;
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
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const ModalTextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  resize: none;
`;

const ModalSubmitButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditProfileModal = ({ isOpen, onClose, profileData, onUpdate }) => {
  const [updatedProfile, setUpdatedProfile] = useState({
    avatar: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profileData) {
      setUpdatedProfile({
        avatar: profileData.avatar || "",
        bio: profileData.bio || "",
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
      const response = await fetch(`${API_URL}/profiles/${profileData.name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: updatedProfile.avatar
            ? { url: updatedProfile.avatar }
            : undefined,
          bio: updatedProfile.bio,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const updatedData = await response.json();
      onUpdate({
        ...profileData,
        avatar: updatedProfile.avatar,
        bio: updatedProfile.bio,
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
          <label htmlFor="avatar">Profile Picture URL:</label>
          <ModalInput
            type="url"
            id="avatar"
            value={updatedProfile.avatar}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, avatar: e.target.value })
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
    bio: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditProfileModal;
