import styled from "styled-components";
import { BreakpointsUx } from "../../constants/breakpoints";

export const DashboardContainer = styled.div`
  min-height: 80vh;
  background-color: #f9fafb;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const MainContent = styled.main`
  padding: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    padding: 1rem;
  }

  @media screen and (max-width: ${BreakpointsUx.mobileLarge}) {
    padding: 0.75rem;
  }
`;

export const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    gap: 1rem;
  }
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
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: ${({ hoverColor }) => hoverColor || "#3b82f6"};
  }

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    padding: 1.25rem 1rem;
  }
`;

export const ModuleIcon = styled.div`
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

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    height: 56px;
    margin-bottom: 0.75rem;

    svg {
      width: 40px !important;
      height: 40px !important;
    }
  }
`;

export const ModuleName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  word-break: break-word;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    font-size: 1rem;
  }
`;

export const ModuleContainer = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
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
