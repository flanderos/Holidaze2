import React, { useState } from "react";
import styled from "styled-components";

// Styled components
const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: poppins, sans-serif;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
`;

const MonthYear = styled.h2`
  margin: 0;
`;

const NavigationButton = styled.button`
  padding: 5px 10px;
  font-size: 16px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
  max-width: 400px;
`;

const Day = styled.div`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background-color: ${(props) => (props.isCurrentDay ? "#007bff" : "white")};
  color: ${(props) => (props.isCurrentDay ? "white" : "black")};
  font-weight: ${(props) => (props.isCurrentDay ? "bold" : "normal")};

  &:hover {
    background-color: ${(props) =>
      props.isCurrentDay ? "#0056b3" : "#f1f1f1"};
    cursor: pointer;
  }
`;

const Weekday = styled.div`
  font-weight: bold;
  text-align: center;
`;

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    // Add blank days for the first week
    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    // Add all days of the month
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const SetDate = () => {};

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavigationButton onClick={handlePrevMonth}>&lt;</NavigationButton>
        <MonthYear>
          {currentDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentDate.getFullYear()}
        </MonthYear>
        <NavigationButton onClick={handleNextMonth}>&gt;</NavigationButton>
      </CalendarHeader>
      <DaysGrid>
        {weekDays.map((day) => (
          <Weekday key={day}>{day}</Weekday>
        ))}
        {days.map((day, index) =>
          day ? (
            <Day
              key={index}
              isCurrentDay={day.toDateString() === new Date().toDateString()}
            >
              {day.getDate()}
            </Day>
          ) : (
            <Day key={index} />
          ),
        )}
      </DaysGrid>
    </CalendarContainer>
  );
};

export default Calendar;
