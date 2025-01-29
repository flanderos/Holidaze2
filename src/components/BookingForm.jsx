import React, { useState } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

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
  font-size: 16px;

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
  border-radius: 5px;
  font-size: 20px;
  font-family: poppins;
  cursor: pointer;
  width: 97%;
  margin: 30px 0px 10px 10px;
  transition: 0.3s;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    text-decoration: underline;
  }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const BookingForm = ({ venueId, maxGuests, onClose, onBookingSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!startDate || !endDate || guests <= 0) {
      setError("All fields must be filled correctly.");
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
      onBookingSuccess(newBooking.data);
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
      setError("An error occurred while booking. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <BookingFormContainer onSubmit={handleBooking}>
      <label htmlFor="startDate">Start Date:</label>
      <StyledInput
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        min={today}
        required
      />
      <label htmlFor="endDate">End Date:</label>
      <StyledInput
        type="date"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={startDate || today}
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
      <SubmitButton type="submit">Book Venue</SubmitButton>
    </BookingFormContainer>
  );
};

export default BookingForm;
