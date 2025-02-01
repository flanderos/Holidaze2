import React from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
`;

const VenueImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const VenueTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const VenueDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const VenueDetails = styled.div`
  font-size: 0.9rem;

  p {
    margin: 5px 0;
  }
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
  width: 100%;

  &:hover {
    background-color: darkred;
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
