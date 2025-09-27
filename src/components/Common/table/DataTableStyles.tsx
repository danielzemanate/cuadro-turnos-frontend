import styled from "styled-components";

export const TableCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

export const Title = styled.h3`
  margin: 0;
  color: #0f2167;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const AddButton = styled.button`
  appearance: none;
  border: none;
  background: #dbeafe;
  color: #0f2167;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #bfdbfe;
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
  }
`;

export const TableScroller = styled.div`
  overflow-x: auto;
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Th = styled.th`
  text-align: left;
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const Tr = styled.tr`
  &:not(:last-child) td {
    border-bottom: 1px solid #f1f5f9;
  }
`;

export const Td = styled.td`
  padding: 0.75rem 0.9rem;
  color: #374151;
  vertical-align: middle;
  background: #ffffff;
`;

export const ActionsCell = styled.td`
  padding: 0.5rem 0.9rem;
`;

export const ActionsGroup = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  appearance: none;
  border: 1px solid #e5e7eb;
  background: ${({ variant }) =>
    variant === "delete" ? "#fff1f2" : "#f9fafb"};
  color: ${({ variant }) => (variant === "delete" ? "#be123c" : "#0f2167")};
  font-weight: 600;
  padding: 0.45rem 0.7rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ variant }) =>
      variant === "delete" ? "#ffe4e6" : "#eef2ff"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }
`;
