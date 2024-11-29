import React from "react";
import styled from "styled-components";

const Button = styled.button`
  height: 50px;
  width: 250px;
  color: #fff;
  background-color: black;
  border-radius: 25px;
  border: 1px solid white;
  font-family: "Michroma", sans-serif;
  transition: 0.6s;
  display: block;
  margin: 0 auto;
  margin-top: 30px;

  &:hover {
    cursor: pointer;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 13px 0px;
  }
`;

const AllVenuesButton = () => {
  return <Button>See all Venues</Button>;
};

export default AllVenuesButton;
