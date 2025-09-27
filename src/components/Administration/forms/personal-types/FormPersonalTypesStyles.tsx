import styled from "styled-components";

export const Card = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
`;

export const Title = styled.h3`
  margin: 0 0 0.75rem 0;
  color: #0f2167;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const Field = styled.div`
  display: grid;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #374151;
`;

export const Input = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.55rem 0.75rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    border-color: #bfdbfe;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const Primary = styled.button`
  appearance: none;
  border: none;
  background: #0f2167;
  color: white;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #0c1a52;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Ghost = styled.button`
  appearance: none;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    transform: translateY(-1px);
  }
`;
