import React, { useState } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StyledForm = styled.form`
  background-color: #fff;
  backdrop-filter: blur(10px);
  color: black;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 450px) {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid;
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  font-size: 17px;
  padding: 10px;
  margin: 10px;
  outline: none;
  font-size: 17px;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-family: poppins;
  width: 90%;
  padding: 10px;
  margin: 10px;
  outline: none;
  font-size: 17px;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  &::placeholder {
    color: #aaa;
    font-style: italic;
  }
`;

const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    margin: 0;
  }
`;

const StyledButton = styled.button`
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

const EditVenueForm = ({ venue, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    description: venue?.description || "",
    price: venue?.price || 0,
    maxGuests: venue?.maxGuests || 0,
    meta: {
      wifi: venue?.meta?.wifi || false,
      parking: venue?.meta?.parking || false,
      breakfast: venue?.meta?.breakfast || false,
      pets: venue?.meta?.pets || false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
      meta: type === "checkbox" ? { ...prev.meta, [name]: checked } : prev.meta,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      maxGuests: Number(formData.maxGuests),
      meta: formData.meta,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/venues/${venue.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update venue");
      }

      alert("Venue updated successfully!");
      onUpdate();
    } catch (error) {
      console.error("Error updating venue:", error);
      alert("Failed to update venue. Try again.");
    }
  };

  return (
    <Overlay>
      <StyledForm onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
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
        <StyledCheckboxGroup>
          <StyledCheckbox>
            <input
              type="checkbox"
              name="wifi"
              checked={formData.meta.wifi}
              onChange={handleChange}
            />
            Wifi
          </StyledCheckbox>
          <StyledCheckbox>
            <input
              type="checkbox"
              name="parking"
              checked={formData.meta.parking}
              onChange={handleChange}
            />
            Parking
          </StyledCheckbox>
          <StyledCheckbox>
            <input
              type="checkbox"
              name="breakfast"
              checked={formData.meta.breakfast}
              onChange={handleChange}
            />
            Breakfast
          </StyledCheckbox>
          <StyledCheckbox>
            <input
              type="checkbox"
              name="pets"
              checked={formData.meta.pets}
              onChange={handleChange}
            />
            Pets
          </StyledCheckbox>
        </StyledCheckboxGroup>
        <StyledButton type="submit">Update Venue</StyledButton>
        <StyledButton type="button" onClick={onClose}>
          Cancel
        </StyledButton>
      </StyledForm>
    </Overlay>
  );
};

export default EditVenueForm;
