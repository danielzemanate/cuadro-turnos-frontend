import styled from "styled-components";

// Card contenedor principal del módulo
export const AdminCard = styled.section`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin: 0 auto;
`;

// Wrapper de tabs completo
export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Lista de tabs (barra superior)
export const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  padding: 0.5rem;
`;

// Botón de tab individual
export const TabButton = styled.button<{ selected?: boolean }>`
  appearance: none;
  border: 2px solid transparent;
  background: ${({ selected }) => (selected ? "#DBEAFE" : "#ffffff")};
  color: ${({ selected }) => (selected ? "#0F2167" : "#374151")};
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
    color: #011e62;
  }

  &:hover {
    transform: translateY(-1px);
    background: ${({ selected }) => (selected ? "#BFDBFE" : "#F9FAFB")};
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
  }
`;

// Panel de contenido del tab
export const TabPanel = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  min-height: 220px;
`;

// Título interno opcional
export const PanelTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f2167;
`;

// Párrafo placeholder
export const PanelText = styled.p`
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
`;
