import styled from "styled-components";

export const SupportStaffWrapper = styled.div`
  width: 100%;
  margin-top: 16px;
`;

export const SupportStaffCard = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  letter-spacing: 0.5px;
  font-weight: 800;
  color: #111827;
`;

export const SubTitle = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
`;

export const HelperText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;

  b {
    color: #111827;
  }
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 10px;
  margin: 14px 0 18px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "#DBEAFE" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#DBEAFE" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#0F2167" : "#111827")};
  font-weight: 800;
  letter-spacing: 0.2px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.15s ease-in-out;

  &:hover {
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.2px;
`;

export const Select = styled.select`
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
`;

export const PrimaryButton = styled.button`
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #ffffff;
  background: #0f2167;
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 0.3px;

  &:hover {
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.18);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;
