import { styled } from "styled-components";

export const Backdrop = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 15, 0.35);
  z-index: 50;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f2167;
`;

export const Body = styled.div`
  padding: 1rem 1.25rem;
  color: #374151;
  background: #f9fafb;
`;

export const Footer = styled.div`
  padding: 0.9rem 1.25rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  background: #fff;
`;

export const Button = styled.button<{ variant?: "primary" | "ghost" }>`
  appearance: none;
  border-radius: 0.65rem;
  font-weight: 700;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === "primary"
      ? `
        background:#0f2167;
        color:#fff;
        border:none;
        &:hover{ background:#0c1a52; transform:translateY(-1px); }
      `
      : `
        background:#fff;
        color:#374151;
        border:1px solid #e5e7eb;
        &:hover{ background:#f9fafb; transform:translateY(-1px); }
      `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
