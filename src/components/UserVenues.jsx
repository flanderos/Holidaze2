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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  width: 85%;
  margin: 0 auto; /* Sentrerer gridet */

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
  width: 100%;

  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 18px;
    margin: 10px 0;
    font-weight: bold;
  }

  p {
    margin: 5px 0;
    color: #555;
  }

  &:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    transform: scale(1.01);
    cursor: pointer;
  }
`;

const VenueDetails = styled.div`
  font-size: 14px;
  color: #555;
  background: #f8f8f8;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  text-align: center;

  h4 {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  p {
    margin: 5px 0;
  }
`;

const BookingList = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  background: #f8f8f8;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  text-align: center;

  h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: 14px;
    margin-bottom: 5px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
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
