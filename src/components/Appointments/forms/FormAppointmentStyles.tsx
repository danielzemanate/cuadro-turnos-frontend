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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.9rem 1rem;
  margin-bottom: 0.5rem;
`;

export const Field = styled.div`
  display: grid;
  gap: 0.4rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.55rem 0.75rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    border-color: #bfdbfe;
  }
`;

export const Select = styled.select`
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.55rem 0.75rem;
  outline: none;
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    border-color: #bfdbfe;
  }
`;

export const TextArea = styled.textarea`
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.55rem 0.75rem;
  outline: none;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;

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
  margin-top: 1rem;
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

  &:hover:not(:disabled) {
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

  &:hover:not(:disabled) {
    background: #f9fafb;
  }
`;

export const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
`;
