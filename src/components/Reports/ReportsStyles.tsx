import styled, { css } from "styled-components";

// ===== Design tokens =====
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
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "2.5rem",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  fontWeights: {
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  radius: {
    md: "10px",
    lg: "14px",
  },
  shadow: {
    md: "0 6px 18px rgba(0,0,0,0.06)",
  },
  breakpoints: {
    md: "768px",
  },
};

const media = {
  md: `@media (max-width: ${theme.breakpoints.md})`,
};

const focus = css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(111, 184, 48, 0.25);
  }
`;

// ===== Layout =====
export const Page = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing["2xl"]};
  background: ${theme.colors.bg};
  display: flex;
  justify-content: center;

  ${media.md} {
    padding: ${theme.spacing.lg};
  }
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
  box-shadow: ${theme.shadow.md};

  ${media.md} {
    padding: ${theme.spacing.lg};
    border-radius: ${theme.radius.md};
  }
`;

// ===== Typography =====
export const Title = styled.h1`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.fontSizes["2xl"]};
  font-weight: ${theme.fontWeights.extrabold};
  color: ${theme.colors.textPrimary};
`;

export const Subtitle = styled.p`
  margin: 0 0 ${theme.spacing["2xl"]} 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.base};
`;

// ===== Form Sections =====
export const Section = styled.section`
  margin-top: ${theme.spacing.xl};
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.lg} 0;
`;

export const Spacer = styled.div<{ $size?: "sm" | "md" | "lg" }>`
  height: ${(p) => {
    switch (p.$size) {
      case "sm":
        return theme.spacing.sm;
      case "md":
        return theme.spacing.lg;
      case "lg":
        return theme.spacing.xl;
      default:
        return theme.spacing.lg;
    }
  }};
`;

// ===== Form Layout =====
export const Grid = styled.div<{ $cols?: number }>`
  display: grid;
  gap: ${theme.spacing.xl};
  grid-template-columns: repeat(${(p) => p.$cols ?? 2}, minmax(0, 1fr));

  ${media.md} {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

// ===== Form Controls =====
export const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
  display: block;
`;

export const Select = styled.select<{ disabled?: boolean }>`
  width: 100%;
  height: 48px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  padding: 0 ${theme.spacing.lg};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSizes.base};
  ${focus}

  &:hover {
    border-color: #9ca3af;
  }

  ${(p) =>
    p.disabled &&
    css`
      background: #f3f4f6;
      cursor: not-allowed;
      color: #9ca3af;
    `}
`;

export const Button = styled.button`
  height: 48px;
  border: none;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeights.bold};
  font-size: ${theme.fontSizes.base};
  padding: 0 ${theme.spacing["2xl"]};
  cursor: pointer;
  transition:
    transform 0.1s ease,
    filter 0.2s ease;
  ${focus}

  &:hover {
    filter: brightness(1.03);
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing["2xl"]};
`;
