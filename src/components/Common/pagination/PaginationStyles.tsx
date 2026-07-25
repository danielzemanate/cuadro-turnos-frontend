import styled from "styled-components";

export const PaginationBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`;

export const PaginationInfo = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const PaginationControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  appearance: none;
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ $active }) => ($active ? "#2563eb" : "#d1d5db")};
  background: ${({ $active }) => ($active ? "#2563eb" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? "#1d4ed8" : "#f9fafb")};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PerPageSelect = styled.select`
  appearance: none;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.45rem 2rem 0.45rem 0.65rem;
  background: #ffffff
    url("data:image/svg+xml;utf8,<svg fill='none' stroke='%236b7280' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/></svg>")
    no-repeat right 0.55rem center / 12px;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.35);
  }
`;
