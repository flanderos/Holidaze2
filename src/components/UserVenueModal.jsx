import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 300px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow-y: auto;
  max-height: 90vh; /* Hindrer at modalen blir for høy */

  @media (max-width: 600px) {
    max-width: 95%;
    padding: 15px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
  max-width: 100%;
  white-space: break-spaces; /* Sikrer at linjebryting skjer */
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: block;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

const BookingList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;

  li {
    margin: 5px 0;
    padding: 10px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: left;
    width: 100%;
  }
`;
const UserVenueModal = ({ venue, isOpen, onClose }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!venue) return;

    const fetchBookedDates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/venues/${venue.id}?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        setBookedDates(data.bookings || []);
      } catch (err) {
        console.error("Error fetching booked dates:", err);
        setError("Could not fetch bookings.");
      }
    };

    fetchBookedDates();
  }, [venue]);

  if (!isOpen || !venue) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{venue.name}</Title>
        <Description>
          {venue.description || "No description available"}
        </Description>
        <h3>Bookings</h3>
        {error && <p>{error}</p>}
        <BookingList>
          {bookedDates.length > 0 ? (
            bookedDates.map((booking) => (
              <li key={booking.id}>
                From: {new Date(booking.dateFrom).toLocaleDateString()} - To:{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </li>
            ))
          ) : (
            <li>No bookings found.</li>
          )}
        </BookingList>
      </ModalContainer>
    </Overlay>
  );
};

export default UserVenueModal;
