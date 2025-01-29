import React, { useState } from "react";
import styled from "styled-components";
import EditVenueForm from "./EditVenueForm";
import { API_URL, API_KEY } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

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
  background-color: var(--color-primary);

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

//Uservenuemodal

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

const UserVenues = ({ venues, onVenueDeleted }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [openModalType, setOpenModalType] = useState(null);

  const fetchVenueDetails = async (id, modalType = "main") => {
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
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch venue details");
      }

      const data = await response.json();

      setSelectedVenue(data);

      // Hent bookings-data før modal åpnes
      if (modalType === "bookings") {
        const bookings = data.data.bookings.map((booking) => ({
          from: booking.dateFrom,
          to: booking.dateTo,
        }));
        setBookedDates(bookings);
        setOpenModalType("bookings"); // ✅ Åpne modal ETTER at bookedDates er satt
      } else {
        setOpenModalType("main");
      }
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

  const closeBookingsModal = () => {
    setIsBookingsModalOpen(false);
    setBookedDates([]);
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
          <VenueCard
            onClick={() => fetchVenueDetails(venue.id, "main")}
            key={venue.id}
          >
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
            <ButtonGroup>
              <ActionButton
                className="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(venue);
                }}
              >
                Edit <FontAwesomeIcon icon={faPenToSquare} />
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(venue.id);
                }}
              >
                Delete <FontAwesomeIcon icon={faTrash} />
              </ActionButton>
              <ActionButton
                className="show-bookings"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchVenueDetails(venue.id, "bookings"); // 🚀 Åpner kun bookings-modal
                }}
              >
                Show Bookings <FontAwesomeIcon icon={faCalendar} />
              </ActionButton>
            </ButtonGroup>
          </VenueCard>
        ))}
      </VenueContainer>

      {loading && <p>Loading venue details...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Bookings Modal */}
      {openModalType === "bookings" && selectedVenue && (
        <ModalOverlay onClick={() => setOpenModalType(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Booked Dates</h3>
            <ul>
              {bookedDates.length > 0 ? (
                bookedDates.map((date, index) => (
                  <li key={index}>
                    From: {new Date(date.from).toLocaleDateString()} To:{" "}
                    {new Date(date.to).toLocaleDateString()}
                  </li>
                ))
              ) : (
                <p>No bookings available</p>
              )}
            </ul>
            <button onClick={() => setOpenModalType(null)}>Close</button>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Venue Modal */}
      {isEditModalOpen && (
        <EditVenueForm
          venue={selectedVenue}
          onClose={closeEditModal}
          onUpdate={() => window.location.reload()}
        />
      )}
      {openModalType === "main" && selectedVenue && (
        <ModalOverlay onClick={() => setOpenModalType(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedVenue.data.name}</h3>
            <img
              src={
                selectedVenue.data.media?.[0]?.url ||
                "https://via.placeholder.com/300"
              }
              alt={selectedVenue.data.name}
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <p>{selectedVenue.data.description}</p>
            <p>Price: ${selectedVenue.data.price}</p>
            <p>Max Guests: {selectedVenue.data.maxGuests}</p>
            <button onClick={() => setOpenModalType(null)}>Close</button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserVenues;
