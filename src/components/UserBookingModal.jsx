import React from "react";
import styled from "styled-components";

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
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
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

const UserBookingModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const { venue } = booking;

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
      </ModalContainer>
    </Overlay>
  );
};

export default UserBookingModal;
