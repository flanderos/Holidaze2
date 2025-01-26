import React, { useState } from "react";
import styled from "styled-components";
import VenueModal from "./Modal";
import EditVenueForm from "./EditVenueForm"; // Nytt komponent
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
  position: relative;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &.edit {
    background-color: #4caf50;
    color: white;
  }

  &.delete {
    background-color: #f44336;
    color: white;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
`;

const UserVenues = ({ venues, onVenueDeleted }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEdit = (venue) => {
    setSelectedVenue(venue);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVenue(null);
  };

  const handleDelete = async (venueId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/venues/${venueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete venue");
      }

      alert("Venue deleted successfully!");
      onVenueDeleted(venueId);
    } catch (err) {
      console.error("Error deleting venue:", err);
      alert("An error occurred while deleting the venue.");
    }
  };

  if (!venues || venues.length === 0) {
    return <p>No venues available for this user.</p>;
  }

  return (
    <>
      <VenueContainer>
        {venues.map((venue) => (
          <VenueCard key={venue.id}>
            <img
              src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
              alt={venue.name}
              onClick={() => fetchVenueDetails(venue.id)}
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
            <ButtonGroup>
              <ActionButton className="edit" onClick={() => handleEdit(venue)}>
                Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(venue.id)}
              >
                Delete
              </ActionButton>
            </ButtonGroup>
          </VenueCard>
        ))}
      </VenueContainer>

      {loading && <p>Loading venue details...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Edit Venue Modal */}
      {isEditModalOpen && (
        <EditVenueForm
          venue={selectedVenue}
          onClose={closeEditModal}
          onUpdate={() => window.location.reload()} // Refresh after editing
        />
      )}
    </>
  );
};

export default UserVenues;
