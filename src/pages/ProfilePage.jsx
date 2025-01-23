import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import EditProfileModal from "../components/EditProfileModal";
import UserVenues from "../components/UserVenues";
import VenueModal from "../components/Modal";
import { API_URL, API_KEY } from "../config";
import styled from "styled-components";
import loginBg from "../assets/images/loginpagebg2.png";
import UserBookings from "../components/UserBookings";

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
`;

const StyledH2 = styled.h2`
  color: #fff;
`;

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profileData) return <div>No profile data found</div>;

  return (
    <>
      <Header />
      <Container>
        <ProfileCard
          profileData={profileData}
          venues={venues}
          onEditClick={() => setIsEditModalOpen(true)}
        />
        <StyledH2>My Venues</StyledH2>
        <UserVenues
          venues={venues}
          onVenueClick={(venue) => {
            setSelectedVenue(venue);
            setIsVenueModalOpen(true);
          }}
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
    </>
  );
};

export default ProfilePage;
