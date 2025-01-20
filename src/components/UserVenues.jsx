import React, { useState } from "react";
import styled from "styled-components";
import VenueModal from "./Modal";
import { API_URL, API_KEY } from "../config";

const VenueContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;

  @media (max-width: 1340px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VenueCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: 0.3s;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 16px;
    margin: 5px 0;
  }

  p {
    margin: 5px 0;
  }

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
    cursor: pointer;
  }
`;

const VenueDetails = styled.div`
  font-size: 14px;
  color: #555;

  h4 {
    font-size: 16px;
    margin: 5px 0;
  }

  p {
    margin: 5px 0;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
`;

const UserVenues = ({ venues }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVenueDetails = async (id) => {
    if (!id) {
      console.error("Venue ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/venues/${id}?_bookings=true`, {
        headers: {
          "X-Noroff-API-Key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch venue details");
      }

      const data = await response.json();
      setSelectedVenue(data);
    } catch (err) {
      console.error("Error fetching venue details:", err);
      setError("Unable to load venue details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVenueClick = (venueId) => {
    fetchVenueDetails(venueId);
  };

  const closeModal = () => {
    setSelectedVenue(null);
  };

  if (!venues || venues.length === 0) {
    return <p>No venues available for this user.</p>;
  }

  return (
    <>
      <VenueContainer>
        {venues.map((venue) => (
          <VenueCard key={venue.id} onClick={() => handleVenueClick(venue.id)}>
            <img
              src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
              alt={venue.name}
            />
            <VenueDetails>
              <h4>{venue.name}</h4>
              <p>
                {venue.description?.substring(0, 40) ||
                  "No description available"}
                ...
              </p>
              <p>Price: ${venue.price}</p>
              <p>Max Guests: {venue.maxGuests}</p>
            </VenueDetails>
          </VenueCard>
        ))}
      </VenueContainer>

      {loading && <p>Loading venue details...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {selectedVenue && (
        <VenueModal
          venue={selectedVenue}
          isOpen={Boolean(selectedVenue)}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default UserVenues;
