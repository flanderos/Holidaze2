import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.5rem;
  color: #2d3748;
`;

const DialogDescription = styled.div`
  margin-bottom: 24px;
  color: #4a5568;

  p {
    margin: 8px 0;
    line-height: 1.5;
  }

  strong {
    color: #2d3748;
  }
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const DialogButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.cancel {
    background: #e2e8f0;
    border: 1px solid #cbd5e0;
    color: #4a5568;

    &:hover {
      background: #cbd5e0;
    }
  }

  &.confirm {
    background: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: black;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const BookingFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  padding: 10px;
  margin: 10px;
  outline: none;
  font-size: 17px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--color-primary);
  }

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::placeholder {
    color: #aaa;
    font-style: italic;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};

  &:hover:not(:disabled) {
    text-decoration: underline;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  padding: 8px;
  margin: 5px 10px;
  background-color: #fff5f5;
  border-radius: 4px;
  border: 1px solid #fed7d7;
`;

const BookingForm = ({
  venueId,
  maxGuests,
  bookedDates,
  onClose,
  onBookingSuccess,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Convert date
  const normalizeDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
  }, []);

  // Check of the date is booked
  const isDateBooked = useCallback(
    (dateToCheck) => {
      return bookedDates.some(
        (bookedDate) => bookedDate.toISOString().split("T")[0] === dateToCheck,
      );
    },
    [bookedDates],
  );

  const isAlreadyBooked = useMemo(() => {
    if (!startDate || !endDate || !bookedDates?.length) return false;

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    // Check every date in the selected range
    const current = new Date(start);
    while (current <= end) {
      const dateString = current.toISOString().split("T")[0];
      if (isDateBooked(dateString)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }

    return false;
  }, [startDate, endDate, bookedDates, normalizeDate, isDateBooked]);

  // Validate date :P
  const validateDates = useCallback(() => {
    if (!startDate || !endDate)
      return "Please select both start and end dates.";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) return "Start date cannot be in the past.";
    if (end < start) return "End date must be after start date.";
    if (isAlreadyBooked)
      return "One or more selected dates are already booked.";

    return "";
  }, [startDate, endDate, isAlreadyBooked]);

  const handleStartDateChange = useCallback(
    (e) => {
      const newStartDate = e.target.value;
      setStartDate(newStartDate);
      setError("");

      // Reset end date if it's before new start date
      if (endDate && new Date(endDate) < new Date(newStartDate)) {
        setEndDate("");
      }
    },
    [endDate],
  );

  const handleEndDateChange = useCallback((e) => {
    setEndDate(e.target.value);
    setError("");
  }, []);

  const handleGuestsChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    setGuests(value);
    setError("");
  }, []);

  const handleConfirmOpen = (e) => {
    e.preventDefault();
    if (isBooking) return;

    setShowConfirmation(false);

    setShowConfirmation(true);
  };

  const handleBooking = async () => {
    if (isBooking) return;

    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (guests <= 0 || guests > maxGuests) {
      setError(`Number of guests must be between 1 and ${maxGuests}`);
      return;
    }

    setIsBooking(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to book.");
      }

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
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || "Booking failed.");
      }

      const newBooking = await response.json();
      onBookingSuccess({
        dateFrom: startDate,
        dateTo: endDate,
        ...newBooking.data,
      });
    } catch (error) {
      console.error("Booking failed:", error);
      setError(
        error.message || "An error occurred while booking. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <BookingFormContainer onSubmit={handleConfirmOpen}>
        {showConfirmation && (
          <DialogOverlay
            onClick={() => !isBooking && setShowConfirmation(false)}
          >
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                <p>Please confirm the following:</p>
                <p>
                  <strong>Checkin:</strong>{" "}
                  {startDate ? formatDate(startDate) : ""}
                </p>
                <p>
                  <strong>Check out:</strong>{" "}
                  {endDate ? formatDate(endDate) : ""}
                </p>
                <p>
                  <strong>Guests:</strong> {guests}
                </p>
              </DialogDescription>
              <DialogFooter>
                <DialogButton
                  className="cancel"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isBooking}
                >
                  Cancel
                </DialogButton>
                <DialogButton
                  className="confirm"
                  onClick={handleBooking}
                  disabled={isBooking}
                >
                  {isBooking ? "Booker..." : "Confirm booking"}
                </DialogButton>
              </DialogFooter>
            </DialogContent>
          </DialogOverlay>
        )}
        <label htmlFor="startDate">Start Date:</label>
        <StyledInput
          type="date"
          id="startDate"
          value={startDate}
          onChange={handleStartDateChange}
          min={today}
          required
          disabled={isBooking}
        />

        <label htmlFor="endDate">End Date:</label>
        <StyledInput
          type="date"
          id="endDate"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate || today}
          required
          disabled={isBooking || !startDate}
        />

        <label htmlFor="guests">Number of Guests:</label>
        <StyledInput
          type="number"
          id="guests"
          value={guests}
          onChange={handleGuestsChange}
          min="1"
          max={maxGuests}
          required
          disabled={isBooking}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton
          type="submit"
          disabled={isBooking || isAlreadyBooked || !startDate || !endDate}
        >
          {isBooking ? "Booking..." : "Book Venue"}
        </SubmitButton>
      </BookingFormContainer>
    </>
  );
};

export default BookingForm;
