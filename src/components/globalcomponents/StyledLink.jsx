import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)`
  color: ${({ color }) => color || "var(--color-primary)"};
  padding: 15px;
  background-color: ${({ bgColor }) => bgColor || "black"};
  width: 200px;
  border-radius: 25px;
  transition: 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin: 0 auto;
  font-family: montserrat;
  margin-top: 20px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    background-color: ${({ $isLogout }) => ($isLogout ? "red" : "black")};
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }
`;
