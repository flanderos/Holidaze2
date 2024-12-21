import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { StyledLink } from "./globalcomponents/StyledLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";
import VenueModal from "./Modal";

// Modal styled components
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
  max-width: 500px;
  width: 90%;
  z-index: 1001;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

// Existing styled components
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: flex-start;
`;

const FilterContainer = styled.div`
  width: 250px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  height: fit-content;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  align-items: start;
  justify-items: center;

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
  justify-content: space-between;
  text-align: center;
  width: 350px;
  height: 450px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
  }
`;

const VenueImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const VenueDetails = styled.div`
  font-size: 14px;
  color: #555;
  display: flex;
  flex-direction: column;

  h4 {
    font-size: 16px;
    margin: 5px 0;
  }

  p {
    margin: 5px 0;
  }
`;

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || "https://v2.api.noroff.dev";
        const response = await fetch(`${API_URL}/holidaze/venues?_owner=true`);
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();

        console.log("Fetched venues:", data.data);

        const sortedVenues = data.data.sort((a, b) => {
          const dateA = new Date(a.created || 0);
          const dateB = new Date(b.created || 0);
          return dateB - dateA;
        });

        setVenues(sortedVenues);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("An error occurred while fetching venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const fetchVenueDetails = async (id) => {
    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "https://v2.api.noroff.dev";
      const response = await fetch(`${API_URL}/holidaze/venues/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch venue details");
      }
      const data = await response.json();
      setSelectedVenue(data.data);
    } catch (err) {
      setError("Failed to load venue details");
    }
  };

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MainContainer>
      <CardGrid>
        {venues.map((venue) => (
          <VenueCard key={venue.id} onClick={() => fetchVenueDetails(venue.id)}>
            <VenueImage
              src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
              alt={venue.name}
            />
            <VenueDetails>
              <h4>{venue.name}</h4>
              <p>
                {venue.description && venue.description.length > 40
                  ? `${venue.description.substring(0, 40)}...`
                  : venue.description || "No description available"}
              </p>
              <p>Price: ${venue.price}</p>
              <p>Max Guests: {venue.maxGuests}</p>
            </VenueDetails>
          </VenueCard>
        ))}
      </CardGrid>

      {/* Modal */}
      {selectedVenue && (
        <VenueModal
          venue={selectedVenue}
          isOpen={!!selectedVenue}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </MainContainer>
  );
};

export default VenueList;
