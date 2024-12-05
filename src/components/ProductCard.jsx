import React from "react";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background-color: #fff;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Media = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Begrens til 3 linjer */
  -webkit-box-orient: vertical;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

const Rating = styled.span`
  font-size: 14px;
  color: #ff9900;
`;

const Guests = styled.span`
  font-size: 14px;
  color: #555;
`;

const ProductCard = ({ product }) => {
  const { name, description, media, price, maxGuests, rating } = product;

  return (
    <Card>
      <Media
        src={media?.[0]?.url || "https://via.placeholder.com/300"}
        alt={name}
      />
      <Content>
        <Title>{name}</Title>
        <Description>{description}</Description>
        <Meta>
          <Price>${price?.toFixed(2) || "N/A"}</Price>
          <Rating>⭐ {rating || "N/A"}</Rating>

          <Guests>{maxGuests} guests</Guests>
        </Meta>
      </Content>
    </Card>
  );
};

export default ProductCard;
