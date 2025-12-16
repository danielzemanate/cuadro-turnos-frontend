import styled, { css } from "styled-components";

// ======================
// DESIGN TOKENS
// ======================
const theme = {
  colors: {
    // Primary colors
    primary: "#6fb830",
    primaryButton: "#0F2167",
    primaryHover: "#5da028",
    primaryLight: "#f8faf8",

    // Neutral colors
    white: "#ffffff",
    gray50: "#f9faf8",
    gray100: "#f1f5f9",
    gray200: "#e2e8f0",
    gray300: "#cbd5e1",
    gray400: "#94a3b8",
    gray500: "#64748b",
    gray600: "#475569",
    gray700: "#334155",
    gray800: "#1e293b",
    gray900: "#0f172a",

    // Text colors
    textPrimary: "#0b1324",
    textSecondary: "#4b5563",
    textMuted: "#6b7280",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Background colors
    bgPrimary: "#ffffff",
    bgSecondary: "#f8fafc",
    bgTertiary: "#f1f5f9",

    // Border colors
    border: "#d1d5db",
    borderLight: "#e5e7eb",
    borderDark: "#9ca3af",

    // Table specific colors
    tableHeader: "#f8faf8",
    tableHeaderBorder: "#c6d3a5",
    tableRowEven: "#fbfcf8",
    tableRowHover: "#f5f7f0",
    tableBorder: "#eef2e6",

    // Novelty colors
    noveltyBg: "#fff5f5",
    noveltyBgLight: "#fff1f2",

    // Patients colors
    patientsBg: "#f0f9ff",

    // Total colors
    totalBg: "#f3f7ea",
    totalBgDark: "#eef4e1",
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "2.5rem", // 40px
    "4xl": "3rem", // 48px
  },

  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// ======================
// MIXINS & UTILITIES
// ======================

// Responsive breakpoint mixin
const media = {
  sm: `@media (max-width: ${theme.breakpoints.sm})`,
  md: `@media (max-width: ${theme.breakpoints.md})`,
  lg: `@media (max-width: ${theme.breakpoints.lg})`,
  xl: `@media (max-width: ${theme.breakpoints.xl})`,
};

// Focus styles mixin
const focusStyles = css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(111, 184, 48, 0.2);
  }
`;

// Button base styles
const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.fontWeights.bold};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;

  ${focusStyles}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:not(:disabled):hover {
    filter: brightness(1.05);
  }

  &:not(:disabled):active {
    transform: translateY(1px);
  }
`;

// Input base styles
const inputBase = css`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.textPrimary};
  transition: border-color 0.2s ease;

  ${focusStyles}

  &:hover {
    border-color: ${theme.colors.borderDark};
  }

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

// ======================
// LAYOUT COMPONENTS
// ======================

export const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing["2xl"]};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: ${theme.colors.bgSecondary};

  ${media.md} {
    padding: ${theme.spacing.lg};
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing["3xl"]} ${theme.spacing["2xl"]}
    ${theme.spacing["4xl"]};
  text-align: center;
  box-shadow: ${theme.shadows.lg};

  ${media.md} {
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
  }
`;

// ======================
// TYPOGRAPHY COMPONENTS
// ======================

export const PageTitle = styled.h1`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.fontSizes["4xl"]};
  font-weight: ${theme.fontWeights.extrabold};
  letter-spacing: 0.5px;
  color: ${theme.colors.textPrimary};

  ${media.md} {
    font-size: ${theme.fontSizes["3xl"]};
  }

  ${media.sm} {
    font-size: ${theme.fontSizes["2xl"]};
  }
`;

export const PageSubtitle = styled.p`
  margin: 0 0 ${theme.spacing["2xl"]} 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.textSecondary};
  line-height: 1.6;

  ${media.md} {
    font-size: ${theme.fontSizes.base};
    margin: 0 0 ${theme.spacing.xl} 0;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes["4xl"]};
  font-weight: ${theme.fontWeights.extrabold};
  color: ${theme.colors.textPrimary};
  text-align: center;

  span {
    display: block;
    font-size: ${theme.fontSizes["3xl"]};
    margin-top: ${theme.spacing.xs};
  }

  ${media.md} {
    font-size: ${theme.fontSizes["3xl"]};

    span {
      font-size: ${theme.fontSizes["2xl"]};
    }
  }

  ${media.sm} {
    font-size: ${theme.fontSizes["2xl"]};

    span {
      font-size: ${theme.fontSizes.xl};
    }
  }
`;

// ======================
// FORM COMPONENTS
// ======================

export const FormGrid = styled.div<{ $columns?: number }>`
  display: grid;
  gap: ${theme.spacing.lg};
  grid-template-columns: repeat(
    ${(props) => props.$columns || 5},
    minmax(0, 1fr)
  );

  ${media.xl} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing.md};
  }

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

export const FormSelect = styled.select`
  ${inputBase}
  width: 100%;
  min-width: 0;
  height: 46px;
  padding: 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.base};

  ${media.md} {
    height: 42px;
    font-size: ${theme.fontSizes.sm};
    padding: 0 ${theme.spacing.sm};
  }
`;

export const FormButton = styled.button`
  ${buttonBase}
  height: 46px;
  padding: 0 ${theme.spacing.xl};
  background: ${theme.colors.primaryButton};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.base};
  letter-spacing: 0.4px;
  width: 100%;

  ${media.md} {
    height: 42px;
    font-size: ${theme.fontSizes.sm};
    padding: 0 ${theme.spacing.lg};
  }
`;

export const FormLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  user-select: none;
  cursor: pointer;
`;

export const FormCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primary};
  cursor: pointer;
`;

// ======================
// TABLE COMPONENTS
// ======================

export const TableSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;
  position: relative;

  ${media.md} {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};

    /* En mobile, mantenemos los botones en una fila separada */
    & > *:first-child,
    & > *:last-child {
      align-self: stretch;
    }
  }
`;

export const TableControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
  margin: ${theme.spacing.md} 0 ${theme.spacing.sm} 0;

  ${media.md} {
    gap: ${theme.spacing.lg};
    margin: ${theme.spacing.sm} 0;
    flex-wrap: wrap;
  }
`;

export const TableContainer = styled.div`
  position: relative;
  max-width: 100%;
  overflow-x: auto;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.borderLight};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.gray100};
    border-radius: ${theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray300};
    border-radius: ${theme.borderRadius.sm};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gray400};
  }

  ${media.md} {
    margin: 0 -${theme.spacing.lg};
    padding: 0 ${theme.spacing.lg};
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

export const DataTable = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: separate;
  border-spacing: 0;
  background: ${theme.colors.white};
  font-size: ${theme.fontSizes.sm};

  ${media.md} {
    font-size: ${theme.fontSizes.xs};
    min-width: 700px;
  }

  ${media.sm} {
    min-width: 600px;
  }
`;

export const stickyFirstColumn = css`
  position: sticky;
  left: 0;
  z-index: 20;
  background: ${theme.colors.gray50};
`;

export const TableHead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TableBody = styled.tbody``;

export const HeaderCell = styled.th<{ $sticky?: boolean }>`
  background: ${theme.colors.tableHeader};
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeights.extrabold};
  padding: ${theme.spacing.sm} ${theme.spacing.xs};
  border-bottom: 2px solid ${theme.colors.tableHeaderBorder};
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  min-width: 50px;
  max-width: 80px;
  font-size: ${theme.fontSizes.sm};

  ${(props) =>
    props.$sticky &&
    css`
      ${stickyFirstColumn};
      background: ${theme.colors
        .tableHeader}; // para que no se note el solapado
    `}

  div:last-child {
    font-size: ${theme.fontSizes.xs};
    font-weight: ${theme.fontWeights.normal};
    color: ${theme.colors.textMuted};
    margin-top: ${theme.spacing.xs};
  }

  ${media.md} {
    padding: ${theme.spacing.sm} ${theme.spacing.xs};
    font-size: ${theme.fontSizes.xs};
    min-width: 45px;
    max-width: 65px;

    ${(props) =>
      props.$sticky &&
      css`
        min-width: 150px;
        max-width: 180px;
      `}
  }

  ${media.sm} {
    padding: ${theme.spacing.xs} ${theme.spacing.xs};
    min-width: 40px;
    max-width: 55px;

    ${(props) =>
      props.$sticky &&
      css`
        min-width: 130px;
        max-width: 160px;
      `}
  }
`;

export const DataCell = styled.td<{ $center?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.tableBorder};
  text-align: ${(props) => (props.$center ? "center" : "left")};
  color: ${theme.colors.textPrimary};
  min-width: 50px;
  max-width: 80px;
  position: relative;
  vertical-align: middle;

  ${media.md} {
    padding: ${theme.spacing.xs} ${theme.spacing.xs};
    min-width: 45px;
    max-width: 65px;
  }

  ${media.sm} {
    padding: ${theme.spacing.xs} ${theme.spacing.xs};
    min-width: 40px;
    max-width: 55px;
  }
`;

export const StaffNameCell = styled.td`
  ${stickyFirstColumn};

  padding: ${theme.spacing.md} ${theme.spacing.sm};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.gray50};
  border-bottom: 1px solid ${theme.colors.tableBorder};
  z-index: 15; // un poco debajo del header pero por encima del resto
  min-width: 180px;
  max-width: 220px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.md} {
    padding: ${theme.spacing.sm} ${theme.spacing.xs};
    font-size: ${theme.fontSizes.xs};
    min-width: 150px;
    max-width: 180px;
  }

  ${media.sm} {
    padding: ${theme.spacing.xs} ${theme.spacing.xs};
    min-width: 130px;
    max-width: 160px;
  }
`;

// ======================
// TABLE ROW VARIANTS
// ======================

export const HoursDataRow = styled.tr`
  background: ${theme.colors.tableRowEven};

  ${DataCell} {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.sm};
  }

  ${StaffNameCell} {
    background: ${theme.colors.tableRowHover};
  }

  ${media.md} {
    ${DataCell} {
      font-size: ${theme.fontSizes.xs};
    }
  }
`;

export const NoveltyDataRow = styled.tr<{ $hours?: boolean }>`
  background: ${(props) =>
    props.$hours ? theme.colors.noveltyBgLight : theme.colors.noveltyBg};

  ${StaffNameCell} {
    background: ${(props) =>
      props.$hours ? theme.colors.noveltyBgLight : theme.colors.noveltyBg};
  }
`;

export const PatientsDataRow = styled.tr`
  background: ${theme.colors.patientsBg};

  ${StaffNameCell} {
    background: ${theme.colors.patientsBg};
  }
`;

export const TotalDataRow = styled.tr`
  background: ${theme.colors.totalBg};

  ${StaffNameCell} {
    font-weight: ${theme.fontWeights.extrabold};
    background: ${theme.colors.totalBgDark};
  }

  ${DataCell} {
    font-weight: ${theme.fontWeights.bold};
  }
`;

// ======================
// ACTION COMPONENTS
// ======================

export const ActionButton = styled.button`
  ${buttonBase}
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
`;

export const BackButton = styled(ActionButton)`
  background: ${theme.colors.white};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.borderLight};
  justify-self: start;

  &:hover {
    background: ${theme.colors.gray50};
    filter: none;
  }

  ${media.md} {
    align-self: flex-start;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

export const DownloadButton = styled(ActionButton)`
  background: ${theme.colors.primaryButton};
  color: ${theme.colors.white};
  justify-self: end;

  ${media.md} {
    align-self: flex-end;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;

// ======================
// UTILITY COMPONENTS
// ======================

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 20;
  backdrop-filter: blur(2px);
`;

export const InputField = styled.input`
  ${inputBase}
  width: 60px;
  text-align: center;
  padding: ${theme.spacing.xs} ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};

  ${media.md} {
    width: 50px;
    font-size: ${theme.fontSizes.xs};
    padding: ${theme.spacing.xs};
  }

  ${media.sm} {
    width: 45px;
  }
`;

export const SelectField = styled.select`
  ${inputBase}
  width: 55px !important;
  min-width: 55px;
  max-width: 55px;
  padding: ${theme.spacing.xs} ${theme.spacing.xs} !important;
  font-size: ${theme.fontSizes.sm} !important;
  text-align: center;
  text-align-last: center;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 1px rgba(111, 184, 48, 0.3);
  }

  ${media.md} {
    width: 50px !important;
    min-width: 50px;
    max-width: 50px;
    font-size: ${theme.fontSizes.xs} !important;
    padding: 1px 2px !important;
  }

  ${media.sm} {
    width: 45px !important;
    min-width: 45px;
    max-width: 45px;
    padding: 1px !important;
  }
`;

// ======================
// ANIMATIONS
// ======================

export const FadeIn = styled.div`
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SlideIn = styled.div`
  animation: slideIn 0.4s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// SUPPORT STAFF BUTTON
export const SupportStaffButton = styled(ActionButton)`
  background: ${theme.colors.primaryButton};
  color: ${theme.colors.white};
  justify-self: end;

  ${media.md} {
    align-self: flex-end;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
  }
`;
