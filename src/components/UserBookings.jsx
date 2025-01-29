import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";
import placeholder from "../assets/images/houseimagemissing.png";
import UserBookingModal from "./UserBookingModal";

const BookingContainer = styled.section`
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

const BookingCard = styled.div`
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

const BookingDetails = styled.div`
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

      console.log(data.data);

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

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  if (!bookings.length) {
    return <p>No bookings available.</p>;
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
        />
      )}
    </>
  );
};

export default UserBookings;
