import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 48rem;
  height: 90vh;
  z-index: 51;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 2.5rem;
  font-weight: bold;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  max-height: 24rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: 600;
`;

const VisitButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  color: black;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d1d5db;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.1rem;
`;

const VenueModal = ({ venue, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Content>
          {!venue && <LoadingText>Laster inn...</LoadingText>}

          {venue && (
            <>
              {venue.data.media?.[0]?.url && (
                <Image
                  src={venue.data.media[0].url}
                  alt={venue.data.media[0].alt}
                />
              )}

              <Title>{venue.data.name}</Title>
              <Description>{venue.data.description}</Description>

              <Grid>
                <div>
                  <Label>Pris:</Label>
                  <p>${venue.data.price}</p>
                </div>
                <div>
                  <Label>Maks gjester:</Label>
                  <p>{venue.data.maxGuests}</p>
                </div>
                <div>
                  <Label>Vurdering:</Label>
                  <p>{venue.data.rating || "N/A"}</p>
                </div>
              </Grid>

              <InfoSection>
                <SectionTitle>Fasiliteter:</SectionTitle>
                <Grid>
                  <p>
                    <Label>WiFi:</Label> {venue.data.meta?.wifi ? "Ja" : "Nei"}
                  </p>
                  <p>
                    <Label>Parkering:</Label>{" "}
                    {venue.data.meta?.parking ? "Ja" : "Nei"}
                  </p>
                  <p>
                    <Label>Frokost:</Label>{" "}
                    {venue.data.meta?.breakfast ? "Ja" : "Nei"}
                  </p>
                  <p>
                    <Label>Kjæledyr:</Label>{" "}
                    {venue.data.meta?.pets ? "Ja" : "Nei"}
                  </p>
                </Grid>
              </InfoSection>

              {venue.data.location && (
                <InfoSection>
                  <SectionTitle>Beliggenhet:</SectionTitle>
                  <p>
                    {venue.data.location.address || "N/A"},{" "}
                    {venue.data.location.city || "N/A"},{" "}
                    {venue.data.location.country || "N/A"}
                  </p>
                </InfoSection>
              )}

              {venue.data.owner && (
                <InfoSection>
                  <SectionTitle>Eier:</SectionTitle>
                  <p>
                    <Label>Navn:</Label> {venue.data.owner.name}
                  </p>
                  <p>
                    <Label>E-post:</Label> {venue.data.owner.email}
                  </p>
                </InfoSection>
              )}

              <VisitButton>Besøk</VisitButton>
            </>
          )}
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default VenueModal;
