import React, { useState } from "react";
import styled from "styled-components";
import { API_URL, API_KEY } from "../config";

const StyledForm = styled.form`
  background-color: transparent;
  backdrop-filter: blur(10px);
  min-width: 300px;
  margin-top: 100px;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  border-radius: 10px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => (props.isInvalid ? "red" : "#ccc")};
  border-radius: 5px;
  font-family: poppins;
  width: 97%;
  padding: 10px;
  margin: 10px;
  outline: none;

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
  width: 97%;
  padding: 10px;
  margin: 10px;
  outline: none;
  resize: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  &::placeholder {
    color: #aaa;
    font-style: italic;
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

export const CreateVenueForm = ({ onClose }) => {
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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (
      !formData.maxGuests ||
      isNaN(formData.maxGuests) ||
      formData.maxGuests <= 0
    )
      newErrors.maxGuests = "Max Guests must be a positive integer.";

    if (
      formData.mediaUrl &&
      !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(formData.mediaUrl)
    ) {
      newErrors.mediaUrl = "Media URL must be a valid URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const venueData = {
      name: formData.name,
      description: formData.description,
      media: formData.mediaUrl
        ? [{ url: formData.mediaUrl, alt: `${formData.name} media` }]
        : [],
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests),
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
      location: {
        address: formData.address || null,
        city: formData.city || null,
        zip: formData.zip || null,
        country: formData.country || null,
        continent: formData.continent || null,
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
        /* const data = await response.json(); */ //Commented out to pass deploy
        alert("Venue created successfully!");

        // Lukk modal etter vellykket opprettelse
        if (onClose) {
          onClose();
        }
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
      {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}

      <StyledTextarea
        name="description"
        placeholder="Description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
        required
      />
      {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}

      <StyledInput
        type="url"
        name="mediaUrl"
        placeholder="Media URL"
        value={formData.mediaUrl}
        onChange={handleChange}
      />
      {errors.mediaUrl && <ErrorMessage>{errors.mediaUrl}</ErrorMessage>}

      <StyledInput
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}

      <StyledInput
        type="number"
        name="maxGuests"
        placeholder="Max Guests"
        value={formData.maxGuests}
        onChange={handleChange}
        required
      />
      {errors.maxGuests && <ErrorMessage>{errors.maxGuests}</ErrorMessage>}

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

export default CreateVenueForm;
