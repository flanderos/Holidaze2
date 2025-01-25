import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VenueCalendar from "../components/VenueCalendar";
import BookingForm from "./BookingForm";
import { API_URL } from "../config";

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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 48rem;
  height: 90vh;
  z-index: 50;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 2.5rem;
  font-weight: bold;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 24rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: 600;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FromDate = styled.div`
  display: flex;
  flex-direction: column;
`;

const VenueModal = ({ venue, isOpen, onClose }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !venue?.data?.id) return;

    const fetchBookedDates = async () => {
      setLoadingDates(true);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/venues/${venue.data.id}?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();


        const dates = data.data.bookings.map((booking) => {
          const start = new Date(booking.dateFrom);
          const end = new Date(booking.dateTo);
          const bookedDateRange = [];


          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            bookedDateRange.push(new Date(d));
          }

          return bookedDateRange;
        }).flat();

        setBookedDates(dates);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to load booking dates.");
      } finally {
        setLoadingDates(false);
      }
    };

    fetchBookedDates();
  }, [isOpen, venue]);

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Content>
          {!venue && <p>Loading...</p>}

          {venue && (
            <>
              {venue.data.media?.[0]?.url && (
                <Image
                  src={venue.data.media[0].url}
                  alt={venue.data.media[0].alt}
                />
              )}

              <Title>{venue.data.name}</Title>
              <Description>{venue.data.description}</Description>

              <Grid>
                <div>
                  <Label>Price:</Label>
                  <p>${venue.data.price}</p>
                </div>
                <div>
                  <Label>Max guests:</Label>
                  <p>{venue.data.maxGuests}</p>
                </div>
                <div>
                  <Label>Rating:</Label>
                  <p>{venue.data.rating || "N/A"}</p>
                </div>
              </Grid>

              <InfoSection>
                <SectionTitle>Facilities:</SectionTitle>
                <Grid>
                  <p>
                    <Label>WiFi:</Label> {venue.data.meta?.wifi ? "Yes" : "No"}
                  </p>
                  <p>
                    <Label>Parking:</Label>{" "}
                    {venue.data.meta?.parking ? "Yes" : "No"}
                  </p>
                  <p>
                    <Label>Breakfast:</Label>{" "}
                    {venue.data.meta?.breakfast ? "Yes" : "No"}
                  </p>
                  <p>
                    <Label>Pets:</Label> {venue.data.meta?.pets ? "Yes" : "No"}
                  </p>
                </Grid>
              </InfoSection>

              <CalendarContainer>
                <FromDate>
                  <h3>Unavailable Dates</h3>
                  {loadingDates && <p>Loading dates...</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {!loadingDates && !error && (
                    <VenueCalendar bookedDates={bookedDates} />
                  )}
                </FromDate>
              </CalendarContainer>
            </>
          )}

          <BookingForm
            venueId={venue.data.id}
            maxGuests={venue.data.maxGuests}
            onClose={onClose}
            onBookingSuccess={(newBooking) =>
              console.log("Booking successful:", newBooking)
            }
          />

        </Content>

      </ModalContainer>
    </Overlay>
  );
};

export default VenueModal;
