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

export const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: flex-end;
  margin-bottom: 0.75rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 210px;
`;

export const FilterLabel = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #374151;
`;

// Reemplaza tu FilterSelect en AdministrationStyles.tsx
export const FilterSelect = styled.select`
  -webkit-appearance: none;
  appearance: none;
  background-color: #ffffff;

  /* Flecha ▼ como background (SVG inline) */
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' stroke='%236b7280' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 14px 14px;

  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.55rem 2.25rem 0.55rem 0.75rem; /* espacio extra a la derecha para la flecha */
  font-size: 0.95rem;
  color: #111827;
  width: 100%;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    /* atenuar la flecha también */
    background-image: url("data:image/svg+xml;utf8,<svg fill='none' stroke='%239ca3af' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/></svg>");
  }
`;

export const FilterActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const FilterButton = styled.button`
  appearance: none;
  border: 0;
  background: #2563eb;
  color: #ffffff;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  appearance: none;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
