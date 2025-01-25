import React from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "../styles/CustomCalendarStyling.css"

const VenueCalendar = ({ bookedDates }) => {
  const isDateDisabled = (date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

  return (
    <Calendar
      inline
      disabledDates={bookedDates}
      minDate={new Date()}
      dateDisabled={isDateDisabled}
    />
  );
};

export default VenueCalendar;