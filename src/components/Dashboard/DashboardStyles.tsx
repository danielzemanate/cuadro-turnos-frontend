import styled from "styled-components";

export const DashboardContainer = styled.div`
  min-height: 80vh;
  background-color: #f9fafb;
`;

export const MainContent = styled.main`
  padding: 2rem;
`;

export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ModuleCard = styled.div<{ bgColor?: string; hoverColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#ffffff"};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: ${({ hoverColor }) => hoverColor || "#3b82f6"};
  }
`;

export const ModuleIcon = styled.div`
  font-size: 20rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  svg {
    width: 50px !important;
    height: 50px !important;
    color: #011e62;
  }
`;

export const ModuleName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

// New styled components for the back button and container
export const ModuleContainer = styled.div`
  /* Container for the active module */
`;

export const BackButtonContainer = styled.div`
  margin-bottom: 1rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  color: #374151;

  &:hover {
    background-color: #e5e7eb;
    transform: translateX(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
