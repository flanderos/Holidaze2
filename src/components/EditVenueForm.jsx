import React, { useState } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditVenueForm = ({ venue, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    description: venue?.description || "",
    price: venue?.price || "",
    maxGuests: venue?.maxGuests || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/venues/${venue.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update venue");
      }

      alert("Venue updated successfully!");
      onUpdate();
    } catch (error) {
      console.error("Error updating venue:", error);
      alert("Failed to update venue. Try again.");
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Edit Venue</h2>
      <StyledInput
        type="text"
        name="name"
        placeholder="Venue Name"
        value={formData.name}
        onChange={handleChange}
      />
      <StyledTextarea
        name="description"
        placeholder="Description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
      />
      <StyledInput
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />
      <StyledInput
        type="number"
        name="maxGuests"
        placeholder="Max Guests"
        value={formData.maxGuests}
        onChange={handleChange}
      />
      <StyledButton type="submit">Update Venue</StyledButton>
      <StyledButton type="button" onClick={onClose}>
        Cancel
      </StyledButton>
    </StyledForm>
  );
};

export default EditVenueForm;
