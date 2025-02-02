import React, { useState, useEffect } from "react";
import styled from "styled-components";
import EditVenueForm from "./EditVenueForm";
import VenueModal from "./Modal"; // Import VenueModal
import { API_URL, API_KEY } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import PlaceholderImage from "../assets/images/houseimagemissing.png";

const VenueContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  width: min(95%, 1400px);
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const VenueCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin: 1rem;
    line-height: 1.4;
  }

  p {
    color: #4a5568;
    line-height: 1.6;
    margin: 0 1rem;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;

    img {
      transform: scale(1.05);
    }
  }
`;

const VenueDetails = styled.div`
  margin: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;

  h4 {
    color: #2d3748;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
    color: #4a5568;
  }
`;

const BookingList = styled.div`
  margin: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  flex-grow: 1;

  h4 {
    color: #2d3748;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 5px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s ease;
  background-color: var(--color-primary);
  color: black;
  font-family: montserrat;

  &:hover {
    text-decoration: underline;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
`;

const UserVenues = ({ venues, onVenueDeleted }) => {
  const [bookings, setBookings] = useState({});
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const venueIds = venues.map((venue) => venue.id);
        const bookingData = {};

        await Promise.all(
          venueIds.map(async (id) => {
            const response = await fetch(
              `${API_URL}/venues/${id}?_bookings=true`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "X-Noroff-API-Key": API_KEY,
                },
              },
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch bookings for venue ${id}`);
            }

            const data = await response.json();
            bookingData[id] =
              data.data?.bookings?.map((booking) => ({
                from: booking.dateFrom
                  ? new Date(booking.dateFrom).toLocaleDateString()
                  : "Unknown",
                to: booking.dateTo
                  ? new Date(booking.dateTo).toLocaleDateString()
                  : "Unknown",
              })) || [];
          }),
        );

        setBookings(bookingData);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    if (venues.length > 0) {
      fetchBookings();
    }
  }, [venues]);

  const handleOpenModal = (venue) => {
    setSelectedVenue(venue);
    setIsVenueModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVenueModalOpen(false);
    setSelectedVenue(null);
  };

  const handleEdit = (venue, e) => {
    e.stopPropagation();
    setSelectedVenue(venue);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (venueId, e) => {
    e.stopPropagation();
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

  return (
    <>
      <VenueContainer>
        {venues.map((venue) => (
          <VenueCard key={venue.id} onClick={() => handleOpenModal(venue)}>
            <img
              src={venue.media?.[0]?.url || PlaceholderImage}
              alt={venue.name}
            />
            <h3>{venue.name}</h3>
            <p>
              {venue.description?.substring(0, 40) ||
                "No description available"}
              ...
            </p>
            <VenueDetails>
              <h4>Price: ${venue.price}</h4>
              <p>Max Guests: {venue.maxGuests}</p>
            </VenueDetails>

            <BookingList>
              <h4>Booked Dates</h4>
              {bookings[venue.id]?.length > 0 ? (
                <ul>
                  {bookings[venue.id].map((date, index) => (
                    <li key={index}>
                      {date.from} - {date.to}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings</p>
              )}
            </BookingList>

            <ButtonGroup>
              <ActionButton onClick={(e) => handleEdit(venue, e)}>
                Edit <FontAwesomeIcon icon={faPenToSquare} />
              </ActionButton>
              <ActionButton onClick={(e) => handleDelete(venue.id, e)}>
                Delete <FontAwesomeIcon icon={faTrash} />
              </ActionButton>
            </ButtonGroup>
          </VenueCard>
        ))}

        {isEditModalOpen && selectedVenue && (
          <EditVenueForm
            venue={selectedVenue}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={() => window.location.reload()}
          />
        )}
      </VenueContainer>
      {isVenueModalOpen && selectedVenue && (
        <VenueModal
          venue={{ data: selectedVenue }}
          isOpen={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UserVenues;
