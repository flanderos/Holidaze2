import React, { useState } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";
import { useMemo } from "react";

const BookingFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid;
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  padding: 10px;
  margin: 10px;
  outline: none;
  font-size: 17px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  color: black;
  background-color: var(--color-primary);
  border: none;
  border-radius: 16px;
  font-size: 20px;
  font-family: poppins;
  cursor: pointer;
  width: 90%;
  margin: 30px 0px 10px 10px;
  transition: 0.3s;
  

  &:hover {
    text-decoration: underline;
box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const BookingForm = ({
  venueId,
  maxGuests,
  bookedDates,
  setBookedDates,
  onClose,
  onBookingSuccess,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false); // Hindrer dobbeltbooking

  // ✅ Flytt `useMemo` til toppen av komponenten
  const isAlreadyBooked = useMemo(() => {
    if (!startDate || !endDate || bookedDates.length === 0) return false;

    const selectedDates = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate <= finalDate) {
      selectedDates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return selectedDates.some((date) => bookedDates.includes(date));
  }, [startDate, endDate, bookedDates]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (isBooking) return;
    setIsBooking(true);

    const token = localStorage.getItem("token");

    if (!startDate || !endDate || guests <= 0) {
      setError("All fields must be filled correctly.");
      setIsBooking(false);
      return;
    }

    if (isAlreadyBooked) {
      setError("One or more of the selected dates are already booked.");
      setIsBooking(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueId,
          dateFrom: startDate,
          dateTo: endDate,
          guests,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        throw new Error("Booking failed.");
      }

      const newBooking = await response.json();
      alert("Booking successful!");

      setBookedDates((prevDates) => [...prevDates, ...newBooking.dateRange]);

      onBookingSuccess(newBooking.data);
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
      setError("An error occurred while booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <BookingFormContainer onSubmit={handleBooking}>
      <label htmlFor="startDate">Start Date:</label>
      <StyledInput
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
        required
      />
      <label htmlFor="endDate">End Date:</label>
      <StyledInput
        type="date"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={startDate || new Date().toISOString().split("T")[0]}
        required
      />
      <label htmlFor="guests">Number of Guests:</label>
      <StyledInput
        type="number"
        id="guests"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        min="1"
        max={maxGuests}
        required
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitButton type="submit" disabled={isBooking || isAlreadyBooked}>
        {isBooking ? "Booking..." : "Book Venue"}
      </SubmitButton>
    </BookingFormContainer>
  );
};

export default BookingForm;
