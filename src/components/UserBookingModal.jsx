import React from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const ModalContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 95%;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  transition: transform 0.3s ease-in-out;
  box-sizing: border-box;

  /* Stilig scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a1a1a1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;

  &::before {
    content: "×";
    font-size: 24px;
    line-height: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: rotate(90deg);
  }
`;

const VenueImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const VenueTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const VenueDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1.5rem;
`;

const VenueDetails = styled.div`
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;

  p {
    color: #4a5568;
    margin: 0.75rem 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const DeleteButton = styled.button`
  background-color: #e53e3e;
  color: white;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: montserrat;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #c53030;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(229, 62, 62, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserBookingModal = ({ booking, isOpen, onClose, onDelete }) => {
  if (!isOpen || !booking) return null;

  const { venue } = booking;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/bookings/${booking.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      alert("Booking deleted successfully!");
      onDelete(booking.id); // Fjerner bookingen fra UI
      onClose(); // Lukker modalen
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {venue.media?.[0]?.url && (
          <VenueImage src={venue.media[0].url} alt={venue.name} />
        )}
        <VenueTitle>{venue.name}</VenueTitle>
        <VenueDescription>
          {venue.description || "No description available"}
        </VenueDescription>
        <VenueDetails>
          <p>Price: ${venue.price}</p>
          <p>Max Guests: {venue.maxGuests}</p>
          <p>Rating: {venue.rating || "N/A"}</p>
        </VenueDetails>

        {/* 🚀 Delete-knapp */}
        <DeleteButton onClick={handleDelete}>
          Cancel booking
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      </ModalContainer>
    </Overlay>
  );
};

export default UserBookingModal;
