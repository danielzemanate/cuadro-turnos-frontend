import styled from "styled-components";

export {
  AdminCard as VacationsCard,
  FiltersRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterActions,
  SecondaryButton,
  TabList,
  TabButton,
  TabPanel,
} from "../Administration/AdministrationStyles";

export const FilterButton = styled.button`
  appearance: none;
  border: 0;
  background: #0f2167;
  color: #ffffff;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;

  &:hover {
    background: #0c1a52;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FilterInput = styled.input`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
  color: #111827;
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AlertBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
`;

export const AlertButton = styled.button`
  position: relative;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid #fcd34d;
  background: #fffbeb;
  color: #92400e;
  cursor: pointer;

  &:hover {
    background: #fef3c7;
  }
`;

export const AlertCount = styled.span`
  position: absolute;
  top: -0.35rem;
  right: -0.35rem;
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: #991b1b;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const FieldError = styled.p`
  margin: 0.35rem 0 0;
  color: #dc2626;
  font-size: 0.8rem;
`;

export const EmptyHint = styled.p`
  margin: 1rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
`;

export const StatusBadge = styled.span<{
  $tone: "pending" | "approved" | "rejected" | "warning" | "high" | "critical";
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
  background: ${({ $tone }) => {
    if ($tone === "approved") return "#d1fae5";
    if ($tone === "rejected" || $tone === "high") return "#fee2e2";
    if ($tone === "warning" || $tone === "pending") return "#fef3c7";
    return "#e5e7eb";
  }};
  color: ${({ $tone }) => {
    if ($tone === "approved") return "#065f46";
    if ($tone === "rejected" || $tone === "high") return "#991b1b";
    if ($tone === "warning" || $tone === "pending") return "#92400e";
    return "#374151";
  }};
`;

export const AlertList = styled.div`
  display: grid;
  gap: 0.85rem;
`;

export const AlertCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 0.9rem 1rem;
`;

export const AlertHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.45rem;
`;

export const AlertTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f2167;
`;

export const AlertMessage = styled.p`
  margin: 0.35rem 0 0.6rem;
  color: #1f2937;
`;

export const MetaGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.45rem 1rem;
  margin: 0;
`;

export const MetaItem = styled.div`
  margin: 0;
`;

export const MetaLabel = styled.dt`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
`;

export const MetaValue = styled.dd`
  margin: 0.1rem 0 0;
  color: #111827;
`;

export const Subheading = styled.h4`
  margin: 0.85rem 0 0.35rem;
  font-size: 0.85rem;
  color: #0f2167;
`;

export const CriticalList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  color: #1f2937;
`;

export const InlineButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const TextButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  color: #0f2167;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
`;

export const Backdrop = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 15, 0.35);
  z-index: 200;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: min(90vh, 820px);
`;

export const ModalHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f2167;
`;

export const ModalBody = styled.div`
  padding: 1rem 1.25rem;
  background: #f9fafb;
  overflow: auto;
`;

export const ModalFooter = styled.div`
  padding: 0.9rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
  background: #fff;
`;

export const PrimaryButton = styled.button`
  appearance: none;
  border: 0;
  background: #0f2167;
  color: #ffffff;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(PrimaryButton)`
  background: #991b1b;

  &:hover:not(:disabled) {
    background: #7f1d1d;
  }
`;

export const GhostButton = styled.button`
  appearance: none;
  background: #ffffff;
  color: #374151;
  border: 1px solid #e5e7eb;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DetailList = styled.dl`
  margin: 0;
`;

export const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 11.5rem 1fr;
  gap: 0.35rem 0.75rem;
  padding: 0.45rem 0;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailLabel = styled.dt`
  margin: 0;
  font-weight: 700;
  color: #6b7280;
  font-size: 0.85rem;
`;

export const DetailValue = styled.dd`
  margin: 0;
  color: #111827;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const DialogField = styled.div`
  display: grid;
  gap: 0.4rem;
  margin-top: 0.75rem;
`;

export const DialogLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const DialogTextArea = styled.textarea`
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  padding: 0.55rem 0.75rem;
  outline: none;
  width: 100%;
  min-height: 88px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    box-shadow: 0 0 0 3px rgba(15, 33, 103, 0.2);
    border-color: #0f2167;
  }
`;

export const DialogHint = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
`;
