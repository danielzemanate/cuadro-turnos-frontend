import styled from "styled-components";
import { BreakpointsUx } from "../../constants/breakpoints";

export const Header = styled.header`
  background-color: #ffffff;
  padding: 0.75rem 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }
`;

export const LogoSection = styled.div`
  flex-shrink: 0;
  min-width: 0;

  img {
    height: 72px;
    max-width: 160px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    img {
      height: 48px;
      max-width: 110px;
    }
  }

  @media screen and (max-width: ${BreakpointsUx.mobileLarge}) {
    img {
      height: 40px;
      max-width: 90px;
    }
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
  justify-content: flex-end;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    gap: 0.35rem;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    gap: 0.4rem;
  }
`;

export const UserIcon = styled.div`
  width: 44px;
  height: 44px;
  background-color: #011e62;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    width: 36px;
    height: 36px;
  }
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  overflow: hidden;

  @media screen and (max-width: ${BreakpointsUx.mobileLarge}) {
    display: none;
  }
`;

export const Greeting = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 400;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    display: none;
  }
`;

export const UserName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    font-size: 0.8125rem;
    max-width: 130px;
  }
`;

export const UserRole = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    font-size: 0.75rem;
  }
`;

export const Separator = styled.div`
  width: 1px;
  height: 36px;
  background-color: #e5e7eb;
  margin: 0 0.25rem;
  flex-shrink: 0;

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    display: none;
  }
`;

export const ConfigSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const ConfigButton = styled.button`
  padding: 0.6rem 0.85rem;
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
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    background-color: #f3f4f6;
  }

  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    padding: 0.5rem;
  }
`;

export const ConfigLabel = styled.span`
  @media screen and (max-width: ${BreakpointsUx.tabletMedium}) {
    display: none;
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
