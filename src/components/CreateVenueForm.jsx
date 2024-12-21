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
  font-size: 16px;
`;

const StyledTextarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
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

export const CreateVenueForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mediaUrl: "",
    price: "",
    maxGuests: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const venueData = {
      name: formData.name,
      description: formData.description,
      media: [
        {
          url: formData.mediaUrl,
          alt: `${formData.name} media`,
        },
      ],
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests),
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
      location: {
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
        continent: formData.continent,
      },
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating venue:", errorData);
        alert("Failed to create venue. Check the input data.");
      } else {
        const data = await response.json();
        console.log("Venue created successfully:", data);
        alert("Venue created successfully!");
      }
    } catch (error) {
      console.error("Error creating venue:", error);
      alert("An error occurred while creating the venue.");
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Create a Venue</h2>
      <StyledInput
        type="text"
        name="name"
        placeholder="Venue Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <StyledTextarea
        name="description"
        placeholder="Description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <StyledInput
        type="url"
        name="mediaUrl"
        placeholder="Media URL"
        value={formData.mediaUrl}
        onChange={handleChange}
      />
      <StyledInput
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <StyledInput
        type="number"
        name="maxGuests"
        placeholder="Max Guests"
        value={formData.maxGuests}
        onChange={handleChange}
        required
      />
      <div>
        <label>
          <input
            type="checkbox"
            name="wifi"
            checked={formData.wifi}
            onChange={handleChange}
          />
          Wifi
        </label>
        <label>
          <input
            type="checkbox"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
          />
          Parking
        </label>
        <label>
          <input
            type="checkbox"
            name="breakfast"
            checked={formData.breakfast}
            onChange={handleChange}
          />
          Breakfast
        </label>
        <label>
          <input
            type="checkbox"
            name="pets"
            checked={formData.pets}
            onChange={handleChange}
          />
          Pets
        </label>
      </div>
      <StyledInput
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="zip"
        placeholder="Zip Code"
        value={formData.zip}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
      />
      <StyledInput
        type="text"
        name="continent"
        placeholder="Continent"
        value={formData.continent}
        onChange={handleChange}
      />
      <StyledButton type="submit">Create Venue</StyledButton>
    </StyledForm>
  );
};
