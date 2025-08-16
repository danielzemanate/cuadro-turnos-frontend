import styled from "styled-components";

/* -------- Pantalla 1: Selección de mes -------- */

export const Wrapper = styled.div`
  min-height: 100%;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 900px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 3rem 2rem 3.25rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);
`;

export const Title = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #0b1324;
`;

export const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  font-size: 1.125rem;
  color: #111827;
`;

export const ControlsRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

export const Select = styled.select`
  min-width: 260px;
  height: 46px;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font-size: 1rem;
  color: #111827;
  outline: none;

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
  }
`;

export const Button = styled.button`
  height: 46px;
  padding: 0 1.25rem;
  border: none;
  border-radius: 6px;
  background: #6fb830;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition:
    transform 0.06s ease,
    filter 0.2s ease;

  &:hover {
    filter: brightness(1.05);
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* -------- Pantalla 2: Tabla de turnos -------- */

export const TableWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto 0.75rem auto;
  position: relative;
`;

export const TableTitle = styled.h2`
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: #0b1324;
  text-align: center;
  flex: 1;

  span {
    display: block;
    font-size: 2rem;
  }
`;

export const DownloadButton = styled.button`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.625rem 0.9rem;
  border: none;
  border-radius: 6px;
  background: #6fb830; /* verde similar al mock */
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s ease;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    filter: brightness(1.06);
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
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.95rem;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(16, 24, 40, 0.04);
`;

export const Th = styled.th`
  position: sticky;
  top: 0;
  background: #f8faf8;
  color: #0b1324;
  font-weight: 800;
  padding: 10px 8px;
  border-bottom: 2px solid #c6d3a5; /* línea verdosa suave */
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
`;

export const Td = styled.td<{ $center?: boolean }>`
  padding: 10px 8px;
  border-bottom: 1px solid #eef2e6;
  text-align: ${(p) => (p.$center ? "center" : "left")};
  color: #0b1324;
`;

export const StaffCell = styled.td`
  padding: 12px 10px;
  font-weight: 700;
  color: #0b1324;
  background: #f9faf8;
  border-bottom: 1px solid #e6eed7;
  position: sticky;
  left: 0;
  z-index: 1;
`;

export const HoursRow = styled.tr`
  background: #fbfcf8;

  ${Td} {
    color: #4b5563;
  }
`;

export const TotalRow = styled.tr`
  background: #f3f7ea;

  ${StaffCell} {
    font-weight: 800;
  }
  ${Td} {
    font-weight: 700;
  }
`;
