import styled from "styled-components";

/* -------- Pantalla 1: Selección de mes -------- */

export const Wrapper = styled.div`
  min-height: 100%;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 1120px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 2.25rem 2rem 2.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    border-radius: 8px;
  }
`;

export const Title = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #0b1324;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  font-size: 1.125rem;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 1.5rem 0;
  }
`;

export const ControlsRow = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  height: 46px;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  color: #111827;
  outline: none;

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
  }

  @media (max-width: 768px) {
    height: 42px;
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
`;

export const Button = styled.button`
  height: 46px;
  padding: 0 1.25rem;
  border: none;
  border-radius: 8px;
  background: #6fb830;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  transition:
    transform 0.06s ease,
    filter 0.2s ease;

  &:hover {
    filter: brightness(1.05);
  }
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    height: 42px;
    font-size: 0.9rem;
    padding: 0 1rem;
  }
`;

/* -------- Pantalla 2: Tabla de turnos -------- */

export const TableWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const TopActions = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto 0.75rem auto;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: center;
  }
`;

export const TableTitle = styled.h2`
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: #0b1324;
  text-align: center;

  span {
    display: block;
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;

    span {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;

    span {
      font-size: 1.25rem;
    }
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #0b1324;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.98);
  }

  @media (max-width: 768px) {
    order: -1;
    justify-self: start;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`;

export const DownloadButton = styled.button`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.625rem 0.9rem;
  border: none;
  border-radius: 8px;
  background: #6fb830;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.06);
  }

  @media (max-width: 768px) {
    justify-self: end;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`;

export const CheckboxRow = styled.div`
  margin: 0.75rem 0 0.5rem 0;

  label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #0b1324;
    user-select: none;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #0b1324;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    text-align: left;
  }
`;

// Contenedor con scroll horizontal para la tabla
export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);

  /* Scrollbar personalizado */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 768px) {
    margin: 0 -1rem;
    padding: 0 1rem;
    border-radius: 0;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 800px; /* Ancho mínimo para evitar que se comprima demasiado */
  border-collapse: collapse;
  background: #fff;
  font-size: 0.95rem;
  overflow: hidden;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    min-width: 700px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    min-width: 600px;
  }
`;

export const Th = styled.th`
  position: sticky;
  top: 0;
  background: #f8faf8;
  color: #0b1324;
  font-weight: 800;
  padding: 10px 6px;
  border-bottom: 2px solid #c6d3a5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  min-width: 50px;
  max-width: 80px;

  &:first-child {
    min-width: 180px;
    max-width: 220px;
    position: sticky;
    left: 0;
    z-index: 3;
  }

  @media (max-width: 768px) {
    padding: 8px 4px;
    font-size: 0.8rem;
    min-width: 45px;
    max-width: 65px;

    &:first-child {
      min-width: 150px;
      max-width: 180px;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 3px;
    font-size: 0.75rem;
    min-width: 40px;
    max-width: 55px;

    &:first-child {
      min-width: 130px;
      max-width: 160px;
    }
  }
`;

export const Td = styled.td<{ $center?: boolean }>`
  padding: 8px 6px;
  border-bottom: 1px solid #eef2e6;
  text-align: ${(p) => (p.$center ? "center" : "left")};
  color: #0b1324;
  min-width: 50px;
  max-width: 80px;
  position: relative;

  /* Estilos para selects dentro de las celdas */
  select {
    width: 55px !important;
    min-width: 55px;
    max-width: 55px;
    padding: 2px 4px !important;
    font-size: 0.8rem !important;
    text-align: center;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #fff;
    outline: none;

    &:focus {
      border-color: #6fb830;
      box-shadow: 0 0 0 1px rgba(111, 184, 48, 0.3);
    }
  }

  @media (max-width: 768px) {
    padding: 6px 4px;
    min-width: 45px;
    max-width: 65px;

    select {
      width: 50px !important;
      min-width: 50px;
      max-width: 50px;
      font-size: 0.75rem !important;
      padding: 1px 2px !important;
    }
  }

  @media (max-width: 480px) {
    padding: 4px 3px;
    min-width: 40px;
    max-width: 55px;

    select {
      width: 45px !important;
      min-width: 45px;
      max-width: 45px;
      font-size: 0.7rem !important;
      padding: 1px !important;
    }
  }
`;

export const StaffCell = styled.td`
  padding: 12px 10px;
  font-weight: 700;
  color: #0b1324;
  background: #f9faf8;
  border-bottom: 1px solid #e6eed7;
  position: sticky;
  left: 0;
  z-index: 2;
  min-width: 180px;
  max-width: 220px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding: 8px 6px;
    font-size: 0.85rem;
    min-width: 150px;
    max-width: 180px;
  }

  @media (max-width: 480px) {
    padding: 6px 4px;
    font-size: 0.8rem;
    min-width: 130px;
    max-width: 160px;
  }
`;

export const HoursRow = styled.tr`
  background: #fbfcf8;

  ${Td} {
    color: #4b5563;
    font-size: 0.9rem;
  }

  ${StaffCell} {
    background: #f5f7f0;
  }

  @media (max-width: 768px) {
    ${Td} {
      font-size: 0.8rem;
    }
  }
`;

export const TotalRow = styled.tr`
  background: #f3f7ea;

  ${StaffCell} {
    font-weight: 800;
    background: #eef4e1;
  }
  ${Td} {
    font-weight: 700;
  }
`;

/* Overlay de carga sobre la tabla */
export const TableLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 4;
`;
