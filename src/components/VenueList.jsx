import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { StyledLink } from "./globalcomponents/StyledLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: flex-start; /* Sørger for at innholdet justeres fra toppen */
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

  // Responsive design:
  @media (max-width: 1340px) {
    grid-template-columns: repeat(
      3,
      1fr
    ); // Three columns for large tablets and smaller screens
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); // Two columns for medium screens
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // A column for small screens
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; // A column for extra small screens
    gap: 5px;
    padding: 5px;
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

const InsideVenueDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || " https://v2.api.noroff.dev";
        const response = await fetch(`${API_URL}/holidaze/venues`);
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();
        setVenues(data.data);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const filteredVenues = venues.filter((venue) => {
    return Object.keys(filters).every((filterKey) => {
      if (filters[filterKey]) {
        return venue.meta?.[filterKey];
      }
      return true;
    });
  });

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MainContainer>
      <FilterContainer>
        <h3>Filter by Amenities</h3>
        <label>
          <input
            type="checkbox"
            name="wifi"
            checked={filters.wifi}
            onChange={handleFilterChange}
          />
          Wifi
        </label>
        <label>
          <input
            type="checkbox"
            name="parking"
            checked={filters.parking}
            onChange={handleFilterChange}
          />
          Parking
        </label>
        <label>
          <input
            type="checkbox"
            name="breakfast"
            checked={filters.breakfast}
            onChange={handleFilterChange}
          />
          Breakfast
        </label>
        <label>
          <input
            type="checkbox"
            name="pets"
            checked={filters.pets}
            onChange={handleFilterChange}
          />
          Pets
        </label>
      </FilterContainer>
      <CardGrid>
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id}>
            <VenueImage
              src={venue.media?.[0]?.url || "https://via.placeholder.com/300"}
              alt={venue.name}
            />
            <VenueDetails>
              <InsideVenueDetails>
                <h4>{venue.name}</h4>
                <p>
                  {venue.description && venue.description.length > 40
                    ? `${venue.description.substring(0, 40)}...`
                    : venue.description || "No description available"}
                </p>
                <p>Price: ${venue.price}</p>
                <p>Max Guests: {venue.maxGuests}</p>
              </InsideVenueDetails>
              <StyledLink bgColor="#E0E0E0" color="black">
                Take a look
              </StyledLink>
            </VenueDetails>
          </VenueCard>
        ))}
      </CardGrid>
    </MainContainer>
  );
};

export default VenueList;
