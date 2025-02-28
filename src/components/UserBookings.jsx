import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";
import placeholder from "../assets/images/houseimagemissing.png";
import UserBookingModal from "./UserBookingModal";

const BookingContainer = styled.section`
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

const BookingCard = styled.div`
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
    margin: 0.5rem 1rem;
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

const BookingDetails = styled.div`
  margin: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  flex-grow: 1;

  h4 {
    color: #2d3748;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  p {
    color: #4a5568;
    margin: 0.5rem 0;
    line-height: 1.5;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
`;

const StyledP = styled.p`
  color: white;
`;

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData?.name || !token) {
        throw new Error("User data or token is missing");
      }

      const response = await fetch(
        `${API_URL}/profiles/${userData.name}/bookings?_venue=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      setBookings(data.data || []);
    } catch (err) {
      setError("Error fetching bookings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const handleDeleteBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((b) => b.id !== bookingId),
    );
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  if (!bookings.length) {
    return <StyledP>No bookings available.</StyledP>;
  }

  return (
    <>
      <BookingContainer>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            onClick={() => setSelectedBooking(booking)}
          >
            <img
              src={booking.venue?.media?.[0]?.url || placeholder}
              alt={booking.venue?.name || "Venue"}
            />
            <BookingDetails>
              <h4>{booking.venue?.name || "Unknown Venue"}</h4>
              <p>
                From: {new Date(booking.dateFrom).toLocaleDateString()} - To:{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p>Guests: {booking.guests}</p>
            </BookingDetails>
          </BookingCard>
        ))}
      </BookingContainer>

      {selectedBooking && (
        <UserBookingModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={closeModal}
          onDelete={handleDeleteBooking}
        />
      )}
    </>
  );
};

export default UserBookings;
