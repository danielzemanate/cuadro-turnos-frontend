import styled from "styled-components";

export const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  margin-bottom: 1rem;
  min-width: 0;
`;

export const CrumbButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0.15rem 0.25rem;
  margin: 0;
  color: #0f2167;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.35rem;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #0c1a52;
    background: #eef2ff;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(15, 33, 103, 0.35);
  }
`;

export const CrumbCurrent = styled.span`
  color: #374151;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.15rem 0.25rem;
  word-break: break-word;
`;

export const CrumbSeparator = styled.span`
  color: #9ca3af;
  font-size: 0.85rem;
  user-select: none;
`;
