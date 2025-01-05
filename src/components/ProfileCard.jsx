import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  margin-top: 50px;
  padding: 10px;
`;

const H1 = styled.h1`
  text-align: center;
`;

const EditProfileButton = styled.button`
  width: 200px;
  border: 1px solid black;
  background-color: white;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    cursor: pointer;
  }
`;

const ProfileCardContainer = styled.div`
  display: flex;
  margin-top: 80px;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const ProfileImage = styled.img`
  height: 200px;
  width: 200px;
  flex: 1;
`;

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  margin-left: 5px;
  margin-right: 5px;
  max-width: 60%;
`;

const ProfileCard = ({ profileData, venues, onEditClick }) => {
  if (!profileData) return <p>Loading...</p>;

  return (
    <Card>
      <H1>Profile</H1>
      <EditProfileButton onClick={onEditClick} aria-label="Edit Profile">
        Edit Profile
      </EditProfileButton>
      <ProfileCardContainer>
        <DetailsContainer>
          <h4>Details</h4>
          <h5>Name:</h5>
          <p>{profileData.name}</p>
          <h5>Email: </h5>
          <p>{profileData.email}</p>
          <h5>Venues</h5>
          <p>{venues.length}</p>
        </DetailsContainer>
        <ProfileImage
          src={profileData.avatar || "/default-avatar.jpg"}
          alt={`${profileData.name}'s profile`}
          onError={(e) => {
            e.target.src = "/default-avatar.jpg";
          }}
        />
        <AboutContainer>
          <h5>About</h5>
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
