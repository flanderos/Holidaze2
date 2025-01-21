import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";

const Card = styled.div`
  background-color: transparent;
  backdrop-filter: blur(11px);
  border-radius: 11px;
  color: #fff;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
`;

const EditProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: #fff;
    color: #333;
  }
`;

const ProfileCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-start;
`;

const ProfileImage = styled.img`
  flex: 1;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DetailsContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    border-bottom: 2px solid #fff;
    padding-bottom: 4px;
  }

  p {
    font-size: 0.9rem;
    color: #ddd;
  }

  span {
    font-weight: bold;
    color: #fff;
  }
`;

const AboutContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    border-bottom: 2px solid #fff;
    padding-bottom: 4px;
  }

  p {
    font-size: 0.9rem;
    color: #ddd;
  }
`;

const ProfileCard = ({ profileData, venues, onEditClick }) => {
  if (!profileData) return <p>Loading...</p>;

  return (
    <Card>
      <Header>
        <Title>Profile</Title>
        <EditProfileButton onClick={onEditClick} aria-label="Edit Profile">
          <FontAwesomeIcon icon={faWrench} />
          Edit Profile
        </EditProfileButton>
      </Header>
      <ProfileCardContainer>
        <ProfileImage
          src={profileData.avatar || "/default-avatar.jpg"}
          alt={`${profileData.name}'s profile`}
          onError={(e) => {
            e.target.src = "/default-avatar.jpg";
          }}
        />
        <DetailsContainer>
          <h4>Details</h4>
          <p>
            <span>Name:</span> {profileData.name}
          </p>
          <p>
            <span>Email:</span> {profileData.email}
          </p>
          <p>
            <span>Venues:</span> {venues.length}
          </p>
        </DetailsContainer>
        <AboutContainer>
          <h4>About</h4>
          <p>{profileData.bio || "No bio available"}</p>
        </AboutContainer>
      </ProfileCardContainer>
    </Card>
  );
};

ProfileCard.propTypes = {
  profileData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  venues: PropTypes.array.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default ProfileCard;
