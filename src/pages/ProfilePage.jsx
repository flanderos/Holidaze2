import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import EditProfileModal from "../components/EditProfileModal";
import UserVenues from "../components/UserVenues";
import VenueModal from "../components/Modal";
import { API_URL, API_KEY } from "../config";
import styled from "styled-components";
import loginBg from "../assets/images/loginpagebg2.png";
import UserBookings from "../components/UserBookings";
import PageTitle from "../../src/utils/PageTitle";
import CreateVenueForm from "../components/CreateVenueForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${loginBg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 20px;
  margin-bottom: 180px;
`;

const StyledH2 = styled.h2`
  color: #fff;
`;

const RegisterVenueManagerButton = styled.button`
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }
`;

const ToggleButton = styled.button`
  padding: 10px;
  color: black;
  background-color: var(--color-primary);
  border: none;
  border-radius: 5px;
  font-size: 20px;
  font-family: poppins;
  cursor: pointer;
  gap: 5px;
  display: flex;
  align-items: center;

  margin: 30px 0px 10px 10px;
  transition: 0.3s;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    text-decoration: underline;
  }
  }
`;

const DropdownContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  transition: all 0.3s ease-in-out;
`;

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [venues, setVenues] = useState([]);
  // eslint-disable-next-line
  const [bookings, setBookings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVenueManager, setIsVenueManager] = useState(
    localStorage.getItem("isVenueManager") === "true",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchProfileData = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      setError("No user data or token found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [venuesResponse, bookingsResponse] = await Promise.all([
        fetch(`${API_URL}/profiles/${userData.name}/venues`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }),
        fetch(`${API_URL}/profiles/${userData.name}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        }),
      ]);

      if (!venuesResponse.ok || !bookingsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [venuesData, bookingsData] = await Promise.all([
        venuesResponse.json(),
        bookingsResponse.json(),
      ]);

      setProfileData(userData);
      setVenues(venuesData.data || []);
      setBookings(bookingsData.data || []);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBecomeVenueManager = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!token || !userData?.name) {
        alert("Authentication error. Please log in again.");
        return;
      }

      // Oppdater brukerens status i API-et
      const response = await fetch(`${API_URL}/profiles/${userData.name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueManager: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update venue manager status in API.");
      }

      // eslint-disable-next-line
      const updatedUser = await response.json();
      localStorage.setItem("isVenueManager", "true");
      setIsVenueManager(true);
      alert("You are now a Venue Manager!");
    } catch (error) {
      console.error("Error updating venue manager status:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfileData();
    setSelectedVenue(null);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profileData) return <div>No profile data found</div>;

  return (
    <>
      <Header />
      <PageTitle title="Holidaze Profile" />
      <Container>
        <ProfileCard
          profileData={profileData}
          venues={venues}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <ToggleButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {isDropdownOpen ? "Cancel Venue Creation" : "Create a New Venue"}{" "}
          <FontAwesomeIcon icon={isDropdownOpen ? faBan : faPlus} />
        </ToggleButton>

        {/* Dropdown for Create Venue Form */}
        <DropdownContainer isOpen={isDropdownOpen}>
          <CreateVenueForm onClose={() => setIsDropdownOpen(false)} />
        </DropdownContainer>
        {!isVenueManager && (
          <RegisterVenueManagerButton onClick={handleBecomeVenueManager}>
            Become a Venue Manager
          </RegisterVenueManagerButton>
        )}

        <StyledH2>My Venues</StyledH2>
        <UserVenues
          venues={venues}
          onVenueDeleted={(deletedVenueId) =>
            setVenues((prevVenues) =>
              prevVenues.filter((v) => v.id !== deletedVenueId),
            )
          }
        />
        <StyledH2>My Bookings</StyledH2>
        <UserBookings />
      </Container>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        profileData={profileData}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={(updatedData) => {
          setProfileData(updatedData);
          localStorage.setItem("userData", JSON.stringify(updatedData));
        }}
      />

      {/* Venue Modal */}
      <VenueModal
        venue={selectedVenue}
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
      />
      <Footer />
    </>
  );
};

export default ProfilePage;
