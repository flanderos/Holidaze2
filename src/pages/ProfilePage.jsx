import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";

// Styled components
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
`;

const Banner = styled.div`
  width: 100%;
  height: 200px;
  background: url(${(props) => props.src}) center/cover no-repeat;
  border-radius: 10px 10px 0 0;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: -50px;
  border: 3px solid white;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-top: 10px;

  h2 {
    margin: 10px 0 5px;
  }

  p {
    margin: 5px 0;
    color: #666;
  }
`;

const MetaInfo = styled.div`
  margin-top: 20px;

  p {
    margin: 5px 0;
  }
`;

const VenueManagerSection = styled.div`
  margin-top: 20px;
  width: 100%;

  h3 {
    text-align: center;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin: 5px 0;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
    }
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

// Main component
const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("token");

    if (userData && token) {
      setProfileData(userData);
      checkVenueManagerStatus(userData.name, token);
    } else {
      console.error("Missing token or user data in localStorage.");
    }
  }, []);

  const checkVenueManagerStatus = async (name, token) => {
    const API_URL = "https://v2.api.noroff.dev/holidaze";

    try {
      if (!name) {
        throw new Error(
          "User name is undefined. Cannot proceed with API call.",
        );
      }

      const response = await fetch(`${API_URL}/profiles/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "25f25dab-635c-4b61-9f81-19f3baab8e25",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API Error: ${response.status}`, errorData);
        if (response.status === 404) {
          throw new Error(`User ${name} not found.`);
        }
        throw new Error(
          `Failed to fetch venue manager status: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("Venue manager status fetched successfully:", data);
      setIsVenueManager(data.venueManager);

      if (data.venueManager) {
        fetchUserVenues(name, token);
      }
    } catch (error) {
      console.error("Error fetching venue manager status:", error.message);
    }
  };

  const fetchUserVenues = async (name, token) => {
    const API_URL = "https://v2.api.noroff.dev/holidaze";
    try {
      const response = await fetch(`${API_URL}/profiles/${name}/venues`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "25f25dab-635c-4b61-9f81-19f3baab8e25",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVenues(data.data || []);
      } else {
        console.error("Failed to fetch venues:", response.status);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const becomeVenueManager = async () => {
    const token = localStorage.getItem("token");
    const API_URL = "https://v2.api.noroff.dev/holidaze";

    try {
      const response = await fetch(`${API_URL}/profiles/${profileData.name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "25f25dab-635c-4b61-9f81-19f3baab8e25",
        },
        body: JSON.stringify({ venueManager: true }),
      });

      if (response.ok) {
        setIsVenueManager(true);
        fetchUserVenues(profileData.name, token);
      } else {
        console.error(
          "Failed to update venue manager status:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error updating venue manager status:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profileData) return <p>No profile data found.</p>;

  const { name, email, bio, avatar, banner } = profileData;

  return (
    <div>
      <Header />
      <ProfileContainer>
        <Banner src={banner || "https://via.placeholder.com/600x200"} />
        <Avatar src={avatar || "https://via.placeholder.com/100"} alt={name} />
        <UserInfo>
          <h2>{name}</h2>
          <p>{email}</p>
          <p>{bio || "This user has not set a bio yet."}</p>
        </UserInfo>
        <MetaInfo>
          <p>
            <strong>Venues:</strong> {venues.length}
          </p>
        </MetaInfo>
        <VenueManagerSection>
          {isVenueManager ? (
            <>
              <h3>Your Venues</h3>
              <ul>
                {venues.length > 0 ? (
                  venues.map((venue) => (
                    <li key={venue.id}>
                      <strong>{venue.name}</strong>
                      <p>{venue.description}</p>
                    </li>
                  ))
                ) : (
                  <p>You have no venues yet.</p>
                )}
              </ul>
            </>
          ) : (
            <>
              <h3>Become a Venue Manager</h3>
              <Button onClick={becomeVenueManager}>Become Venue Manager</Button>
            </>
          )}
        </VenueManagerSection>
      </ProfileContainer>
    </div>
  );
};

export default ProfilePage;
