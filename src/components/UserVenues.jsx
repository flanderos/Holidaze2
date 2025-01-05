import React, { useState } from "react";
import styled from "styled-components";
import VenueModal from "./Modal";

const VenueContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  align-items: start;
  justify-items: center;
  border: 1px solid black;

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
  padding: 10px;
  text-align: center;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.02);
  }
`;

const UserVenues = ({ venues }) => {
  const [selectedVenue, setSelectedVenue] = useState(null);

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
  };

  const closeModal = () => {
    setSelectedVenue(null);
  };

  if (!venues || venues.length === 0) {
    return <p>User has no venues.</p>;
  }

  return (
    <>
      <VenueContainer>
        {venues.map((venue) => (
          <VenueCard key={venue.id} onClick={() => handleVenueClick(venue)}>
            <img
              src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
              alt={venue.name}
            />
            <h3>{venue.name}</h3>
            <p>{venue.description}</p>
          </VenueCard>
        ))}
      </VenueContainer>
      {selectedVenue && (
        <VenueModal
          venue={selectedVenue}
          isOpen={Boolean(selectedVenue)}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default UserVenues;
