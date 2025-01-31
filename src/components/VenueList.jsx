import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VenueModal from "./Modal";
import { API_URL, API_KEY } from "../config";

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0 12px;
  font-family: "Poppins", sans-serif;
  font-size: 17px;
  color: #333;
  outline: none;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }

  &:hover {
    border-color: #007bff;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  min-height: 50vh;

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
  text-align: center;
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

const NoVenuesFound = styled.div`
display-flex;
justify-content: center;
align-items: center;
height: 400px;
width: 100%;
text-align: center;
font-weight: bold;

`;

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Fetch all venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/venues?_owner=true`, {
          headers: {
            "X-Noroff-API-Key": API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();

        const sortedVenues = data.data.sort(
          (a, b) => new Date(b.created) - new Date(a.created),
        );
        setVenues(sortedVenues);
        setFilteredVenues(sortedVenues);
      } catch (err) {
        setError("Error fetching venues. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues based on the search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = venues.filter((venue) =>
      venue.name?.toLowerCase().includes(term),
    );

    setFilteredVenues(filtered);
  };

  const fetchVenueDetails = async (id) => {
    if (!id) {
      console.error("Venue ID is undefined");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/venues/${id}?_bookings=true&_owner=true`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch venue details");
      }
      const data = await response.json();

      setSelectedVenue(data);
    } catch (err) {
      console.error("Error fetching venue details:", err);
    }
  };

  if (loading) return <p>Loading venues...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <MainContainer>
      <SearchInput
        type="text"
        placeholder="Search venues by title..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Show the ERror message here*/}
      {filteredVenues.length === 0 && (
        <NoVenuesFound>
          <p>No venues found for "{searchTerm}". Try another search term.</p>
        </NoVenuesFound>
      )}

      {/* Show search results here */}
      {filteredVenues.length > 0 && (
        <CardGrid>
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              onClick={() => fetchVenueDetails(venue.id)}
            >
              <VenueImage
                src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
                alt={venue.name}
              />
              <VenueDetails>
                <h4>{venue.name}</h4>
                <p>
                  {venue.description?.substring(0, 40) ||
                    "No description available"}
                  ...
                </p>
                <p>Price: ${venue.price}</p>
                <p>Max Guests: {venue.maxGuests}</p>
              </VenueDetails>
            </VenueCard>
          ))}
        </CardGrid>
      )}

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
