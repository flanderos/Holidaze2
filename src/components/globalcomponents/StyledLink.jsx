import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)`
  color: ${({ color }) => color || "white"};
  padding: 15px;
  background-color: ${({ bgColor }) => bgColor || "black"};
  width: 200px;
  border-radius: 25px;
  font-family: "Michroma", sans-serif;
  transition: 0.6s;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin: 0 auto;
  font-family: montserrat;

  &:hover {
    cursor: pointer;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
`;
