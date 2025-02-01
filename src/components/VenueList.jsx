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
  width: 350px;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &:hover {
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
  }

  @media (max-width: 1500px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
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
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;

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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  width: 100%;
  text-align: center;
  font-weight: bold;
`;

const LoadMoreButton = styled.button`
  padding: 10px;
  color: black;
  background-color: var(--color-primary);
  border: none;
  border-radius: 5px;
  font-size: 20px;
  font-family: poppins;
  cursor: pointer;
  width: 50%;
  margin: 30px 0px 10px 10px;
  transition: 0.3s;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    text-decoration: underline;
  }
  }
`;

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/venues?_owner=true&limit=100&page=${page}`,
          {
            headers: { "X-Noroff-API-Key": API_KEY },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();

        if (data.data.length === 0) {
          setHasMore(false); // Hide the "Load More" Button if there is no more Venues
        } else {
          setVenues((prev) => [...prev, ...data.data]);
          setFilteredVenues((prev) => [...prev, ...data.data]);
        }
      } catch (err) {
        setError("Error fetching venues. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [page]);

  // Filter venues based on search
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

  if (loading && venues.length === 0) return <p>Loading venues...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <MainContainer>
      <SearchInput
        type="text"
        placeholder="Search venues by title..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {filteredVenues.length === 0 && (
        <NoVenuesFound>
          <p>No venues found for "{searchTerm}". Try another search term.</p>
        </NoVenuesFound>
      )}

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

      {hasMore && !loading && (
        <LoadMoreButton onClick={() => setPage((prev) => prev + 1)}>
          Load More
        </LoadMoreButton>
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
