import styled from "styled-components";

export {
  AdminCard as AppointmentsCard,
  FiltersRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterActions,
  SecondaryButton,
} from "../Administration/AdministrationStyles";

export const FilterButton = styled.button`
  appearance: none;
  border: 0;
  background: #0f2167;
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
    background: #0c1a52;
    box-shadow: 0 6px 16px rgba(15, 33, 103, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FilterInput = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
  color: #111827;
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const RequiredMark = styled.span`
  color: #dc2626;
  margin-left: 0.15rem;
`;

export const EmptyHint = styled.p`
  margin: 1rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
`;

export const DialogField = styled.div`
  display: grid;
  gap: 0.4rem;
  margin-top: 0.75rem;
`;

export const DialogLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const DialogTextArea = styled.textarea`
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.55rem 0.75rem;
  outline: none;
  width: 100%;
  min-height: 88px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    box-shadow: 0 0 0 3px rgba(15, 33, 103, 0.2);
    border-color: #0f2167;
  }
`;

export const DialogHint = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
`;
