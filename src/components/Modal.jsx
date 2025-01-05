import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BookingForm from "./BookingForm"; // Importer BookingForm
import PropTypes from "prop-types";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
  height: 90vh;
  z-index: 1001;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 80vh;
  overflow-y: auto;
`;

const SubmitButton = styled.button`
  width: 200px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const BookingOverlay = styled(Overlay)`
  z-index: 1100;
`;

const BookingModal = styled(Modal)`
  max-width: 500px;
  height: auto;
`;

const VenueModal = ({ venue, isOpen, onClose }) => {
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  if (!venue) return null;

  const {
    name,
    description,
    media,
    price,
    maxGuests,
    rating,
    meta,
    location,
    owner,
  } = venue;

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <ModalContent>
            {media?.[0]?.url && (
              <img src={media[0].url} alt={media[0].alt || name} />
            )}
            <h2>{name}</h2>
            <p>{description}</p>
            <p>
              <strong>Price:</strong> ${price}
            </p>
            <p>
              <strong>Max Guests:</strong> {maxGuests}
            </p>
            <p>
              <strong>Rating:</strong> {rating || "N/A"}
            </p>
            <ul>
              <li>
                <strong>WiFi:</strong> {meta?.wifi ? "Yes" : "No"}
              </li>
              <li>
                <strong>Parking:</strong> {meta?.parking ? "Yes" : "No"}
              </li>
              <li>
                <strong>Breakfast:</strong> {meta?.breakfast ? "Yes" : "No"}
              </li>
              <li>
                <strong>Pets:</strong> {meta?.pets ? "Yes" : "No"}
              </li>
            </ul>
            <h3>Location</h3>
            <p>
              {location?.address || "N/A"}, {location?.city || "N/A"},{" "}
              {location?.country || "N/A"}
            </p>
            {owner && (
              <>
                <h3>Owner</h3>
                <p>
                  <strong>Name:</strong> {owner.name}
                </p>
                <p>
                  <strong>Email:</strong> {owner.email}
                </p>
              </>
            )}
            <SubmitButton onClick={() => setIsBookingFormOpen(true)}>
              Book Now
            </SubmitButton>
          </ModalContent>
        </Modal>
      </Overlay>

      <BookingOverlay
        isOpen={isBookingFormOpen}
        onClick={() => setIsBookingFormOpen(false)}
      >
        <BookingModal onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={() => setIsBookingFormOpen(false)}>
            &times;
          </CloseButton>
          <h2>Book Venue</h2>
          <BookingForm
            venueId={venue.id}
            maxGuests={maxGuests}
            onClose={() => setIsBookingFormOpen(false)}
          />
        </BookingModal>
      </BookingOverlay>
    </>
  );
};

// Legg til PropTypes for type-sjekking
VenueModal.propTypes = {
  venue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
      }),
    ),
    price: PropTypes.number,
    maxGuests: PropTypes.number,
    rating: PropTypes.number,
    meta: PropTypes.shape({
      wifi: PropTypes.bool,
      parking: PropTypes.bool,
      breakfast: PropTypes.bool,
      pets: PropTypes.bool,
    }),
    location: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    owner: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VenueModal;
