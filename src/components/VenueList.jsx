import React, { useState, useEffect, useCallback, useRef } from "react";
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

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 45px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0 45px 0 15px;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
  background-color: white;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }

  &:hover {
    border-color: #007bff;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;

  svg {
    width: 18px;
    height: 18px;
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
  border: 1px solid #eaeaea;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  transition: all 0.3s ease-in-out;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    cursor: pointer;
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007bff, #00bfff);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const VenueImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  ${VenueCard}:hover & {
    transform: scale(1.02);
  }
`;

const VenueDetails = styled.div`
  font-size: 14px;
  color: #555;
  width: 100%;
  padding: 0 8px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  p:not(:last-child) {
    padding-bottom: 8px;
    border-bottom: 1px solid #edf2f7;
  }

  p:nth-child(2) {
    color: #718096;
    font-style: italic;
  }

  p:nth-child(3),
  p:nth-child(4) {
    font-weight: 500;
    color: #4a5568;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
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
  padding: 10px 20px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  width: auto;
  margin: 20px 0;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #007bff;
`;

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchVenues = useCallback(async (pageNumber) => {
    try {
      const response = await fetch(
        `${API_URL}/venues?_owner=true&limit=12&page=${pageNumber}&sort=created&sortOrder=desc`,
        {
          headers: { "X-Noroff-API-Key": API_KEY },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error("Error fetching venues. Please try again later.");
    }
  }, []);

  useEffect(() => {
    const loadInitialVenues = async () => {
      try {
        setLoading(true);
        const initialVenues = await fetchVenues(1);
        setVenues(initialVenues);
        setHasMore(initialVenues.length === 12);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialVenues();
  }, [fetchVenues]);

  const loadMoreVenues = async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const newVenues = await fetchVenues(nextPage);

      if (newVenues.length === 0) {
        setHasMore(false);
      } else {
        setVenues((prev) => [...prev, ...newVenues]);
        setPage(nextPage);
        setHasMore(newVenues.length === 12);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  const handleSearch = useCallback(
    async (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      if (!value.trim()) {
        setIsSearching(false);
        const initialVenues = await fetchVenues(1);
        setVenues(initialVenues);
        setPage(1);
        setHasMore(initialVenues.length === 12);
        return;
      }

      searchTimeout.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          setLoading(true);

          const response = await fetch(
            `${API_URL}/venues/search?q=${encodeURIComponent(value.trim())}`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
              },
            },
          );

          if (!response.ok) {
            throw new Error("Søket feilet");
          }

          const data = await response.json();
          setVenues(data.data || []);
          setHasMore(false);
        } catch (err) {
          setError("Søket feilet. Vennligst prøv igjen.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [fetchVenues],
  );

  const fetchVenueDetails = useCallback(async (id) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${API_URL}/venues/${id}?_bookings=true&_owner=true`,
        {
          headers: { "X-Noroff-API-Key": API_KEY },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch venue details");
      }

      const data = await response.json();
      setSelectedVenue(data);
    } catch (err) {
      console.error("Error fetching venue details:", err);
    }
  }, []);

  if (loading && venues.length === 0) {
    return <LoadingSpinner>Loading venues...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <MainContainer>
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Søk etter venue navn eller beskrivelse..."
          value={searchTerm}
          onChange={handleSearch}
          disabled={loading}
        />
        <SearchIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </SearchIcon>
      </SearchWrapper>

      {venues.length === 0 ? (
        <NoVenuesFound>
          <p>No venues found for "{searchTerm}". Try another search term.</p>
        </NoVenuesFound>
      ) : (
        <>
          <CardGrid>
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                onClick={() => fetchVenueDetails(venue.id)}
              >
                <VenueImage
                  src={
                    venue.media?.[0]?.url || "https://via.placeholder.com/300"
                  }
                  alt={venue.name}
                />
                <VenueDetails>
                  <h4>{venue.name}</h4>
                  <p>{venue.description || "No description available"}</p>
                  <p>Price: ${venue.price}</p>
                  <p>Max Guests: {venue.maxGuests}</p>
                </VenueDetails>
              </VenueCard>
            ))}
          </CardGrid>

          {hasMore && !isSearching && (
            <LoadMoreButton onClick={loadMoreVenues} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading..." : "Load More"}
            </LoadMoreButton>
          )}
        </>
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
