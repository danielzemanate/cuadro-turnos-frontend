import styled, { css } from "styled-components";

const theme = {
  colors: {
    primary: "#6fb830",
    primaryHover: "#5da028",
    white: "#ffffff",
    textPrimary: "#0b1324",
    textSecondary: "#4b5563",
    border: "#d1d5db",
    borderLight: "#e5e7eb",
    bg: "#f8fafc",
    card: "#ffffff",
    activeBorder: "#0f2167",
    activeBg: "#eff6ff",
  },
  spacing: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  fontSizes: {
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    "2xl": "1.5rem",
  },
  radius: {
    md: "10px",
    lg: "14px",
  },
};

export const Page = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing["2xl"]};
  background: ${theme.colors.bg};
  display: flex;
  justify-content: center;
`;

export const Wrap = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const Card = styled.div`
  background: ${theme.colors.card};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing["2xl"]};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
`;

export const Title = styled.h1`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.fontSizes["2xl"]};
  font-weight: 800;
  color: ${theme.colors.textPrimary};
`;

export const Subtitle = styled.p`
  margin: 0 0 ${theme.spacing["2xl"]} 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.base};
`;

export const KindGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const KindCard = styled.button<{ $active?: boolean }>`
  appearance: none;
  text-align: left;
  cursor: pointer;
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  ${(p) =>
    p.$active &&
    css`
      border-color: ${theme.colors.activeBorder};
      background: ${theme.colors.activeBg};
    `}

  &:hover {
    border-color: ${theme.colors.activeBorder};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const KindName = styled.span`
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSizes.lg};
`;

export const KindHint = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: 1.4;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

export const FileInput = styled.input`
  width: 100%;
  max-width: 420px;
`;

export const FileName = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${theme.spacing["2xl"]};
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  height: 48px;
  border-radius: ${theme.radius.md};
  font-weight: 700;
  font-size: ${theme.fontSizes.base};
  padding: 0 ${theme.spacing["2xl"]};
  cursor: pointer;

  ${(p) =>
    p.$variant === "secondary"
      ? css`
          border: 1px solid ${theme.colors.activeBorder};
          background: ${theme.colors.white};
          color: ${theme.colors.activeBorder};

          &:hover:not(:disabled) {
            background: ${theme.colors.activeBg};
          }
        `
      : css`
          border: none;
          background: ${theme.colors.primary};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
          }
        `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Summary = styled.div`
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.bg};
  display: grid;
  gap: ${theme.spacing.sm};
`;

export const SummaryTitle = styled.h2`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const SummaryRow = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

export const SummaryList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`;
