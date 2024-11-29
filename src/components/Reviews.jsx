import React from "react";
import styled from "styled-components";

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  color: white;
  margin-top: 30px;
`;

const StyledDiv = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 50px;
`;

const StyledH1 = styled.h1`
  font-size: 40px;
`;

const StyledQuote = styled.blockquote`
  font-family: "Edu AU VIC WA NT Hand";
  font-size: 30px;
`;

const Reviews = () => {
  return (
    <StyledContainer>
      <StyledDiv>
        <h1>What people say</h1>
        <StyledQuote>
          Frankly, no one builds venues like this anymore. It’s classy. It’s
          luxurious. It’s like the Mar-a-Lago of event spaces, but even better,
          because I said so. Believe me."*
        </StyledQuote>
        <p>Donald Trump</p>
      </StyledDiv>
    </StyledContainer>
  );
};

export default Reviews;
