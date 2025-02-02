import React, { useState, useEffect } from "react";
import styled from "styled-components";
import VenueCalendar from "../components/VenueCalendar";
import BookingForm from "./BookingForm";
import { API_URL } from "../config";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
    ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  width: 90%;
  max-width: 48rem;
  height: 90vh;
  z-index: 50;
  background: white;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;
  z-index: 51;

  &::before {
    content: "×";
    font-size: 24px;
    line-height: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: rotate(90deg);
  }
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 2rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a1a1a1;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.3;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding-right: 2.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 1.5rem;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
`;

const CreatorAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CreatorName = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
`;

const CreatorEmail = styled.span`
  font-size: 0.9rem;
  color: #718096;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: 500;
  color: #4a5568;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  background: #f7fafc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const UnavailableDates = styled.div`
  text-align: center;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const VenueModal = ({ venue, isOpen, onClose }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        const dates = data.data.bookings
          .map((booking) => {
            const start = new Date(booking.dateFrom);
            const end = new Date(booking.dateTo);
            const bookedDateRange = [];

            for (
              let d = new Date(start);
              d <= end;
              d.setDate(d.getDate() + 1)
            ) {
              bookedDateRange.push(new Date(d));
            }

            return bookedDateRange;
          })
          .flat();

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

              {/* Creator Information */}
              {venue.data.owner && (
                <CreatorInfo>
                  <CreatorAvatar
                    src={
                      venue.data.owner.avatar?.url ||
                      "https://via.placeholder.com/50"
                    }
                    alt={venue.data.owner.avatar?.alt || "Owner Avatar"}
                  />
                  <CreatorName>{venue.data.owner.name}</CreatorName>
                  <CreatorEmail>{venue.data.owner.email}</CreatorEmail>
                </CreatorInfo>
              )}

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
                <UnavailableDates>
                  <h3>Unavailable Dates</h3>
                  {loadingDates && <p>Loading dates...</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {!loadingDates && !error && (
                    <VenueCalendar bookedDates={bookedDates} />
                  )}
                </UnavailableDates>
              </CalendarContainer>
            </>
          )}

          <BookingForm
            venueId={venue.data.id}
            maxGuests={venue.data.maxGuests}
            bookedDates={bookedDates}
            setBookedDates={setBookedDates} // 🟢 Send funksjonen videre
            onClose={onClose}
            onBookingSuccess={(newBooking) => {
              console.log("Booking successful:", newBooking);
              setBookedDates((prevDates) => [
                ...prevDates,
                ...newBooking.dateRange, // 🔥 Oppdater bookedDates med nye bookede datoer
              ]);
              onClose();
            }}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default VenueModal;
