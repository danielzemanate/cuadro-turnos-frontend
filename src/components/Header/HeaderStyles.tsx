import styled from 'styled-components';

export const Header = styled.header`
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoSection = styled.div`
  img {
    height: 100px;
    max-width: 200px;
    object-fit: contain;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #011e62;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const Greeting = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
`;

export const UserName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

export const UserRole = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
`;

export const Separator = styled.div`
  width: 1px;
  height: 40px;
  background-color: #e5e7eb;
  margin: 0 0.5rem;
`;

export const ConfigSection = styled.div`
  position: relative;
`;

export const ConfigButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: transparent;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 10;
  margin-top: 0.25rem;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: transparent;
  border: none;
  text-align: left;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }

  &:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  svg {
    margin-right: 8px;
  }
`;
