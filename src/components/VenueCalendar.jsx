import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  .react-calendar {
    width: 100%;
    max-width: 600px;
    margin: auto;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .booked-date {
    background-color: #f8d7da !important;
    color: #721c24 !important;
    pointer-events: none;
    opacity: 0.6;
  }

  .react-calendar__tile--active {
    background-color: #007bff !important;
    color: white !important;
  }

  .react-calendar__tile:enabled:hover {
    background-color: #e6f3ff !important;
  }
`;

const VenueCalendar = ({ bookings, onDateSelect }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const isDateBooked = (date) => {
    return bookings.some((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);
      return date >= start && date <= end;
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month" && isDateBooked(date)) {
      return "booked-date";
    }
    return null;
  };

  const tileDisabled = ({ date }) => {
    return isDateBooked(date);
  };

  const handleDateChange = (dates) => {
    if (Array.isArray(dates) && dates.every((date) => date instanceof Date)) {
      setSelectedDates(dates);
    } else {
      console.error("Invalid dates:", dates);
    }
  };

  return (
    <CalendarWrapper>
      <Calendar
        onChange={handleDateChange}
        value={selectedDates}
        selectRange={true}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        minDate={new Date()}
      />
    </CalendarWrapper>
  );
};

export default VenueCalendar;
