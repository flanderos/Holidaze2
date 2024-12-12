import React from "react";
import styled from "styled-components";

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
  padding: 20px;
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
  font-size: 30px;
  cursor: pointer;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  img {
    width: 100%;
    height: auto;
    max-height: 400px;
    border-radius: 10px;
  }
`;

const VenueModal = ({ venue, isOpen, onClose }) => {
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
        </ModalContent>
      </Modal>
    </Overlay>
  );
};

export default VenueModal;
