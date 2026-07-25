import styled from "styled-components";

export type TableLayout = "fill" | "fit";

export const TableCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

export const Title = styled.h3`
  margin: 0;
  color: #0f2167;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const AddButton = styled.button`
  appearance: none;
  border: none;
  background: #dbeafe;
  color: #0f2167;
  font-weight: 700;
  padding: 0.6rem 1rem;
  border-radius: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #bfdbfe;
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
  }
`;

export const TableScroller = styled.div`
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table<{ $layout?: TableLayout }>`
  width: ${({ $layout }) => ($layout === "fit" ? "max-content" : "100%")};
  min-width: ${({ $layout }) => ($layout === "fit" ? "0" : "100%")};
  border-collapse: separate;
  border-spacing: 0;
  table-layout: auto;
  font-size: 0.75rem;
`;

export const Th = styled.th<{ $actions?: boolean; $layout?: TableLayout }>`
  text-align: left;
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  font-size: 0.6875rem;
  padding: 0.4rem 0.3rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1;
  white-space: nowrap;
  ${({ $layout }) =>
    $layout === "fit" &&
    `
    width: 1%;
  `}
  ${({ $actions, $layout }) =>
    $actions &&
    ($layout === "fit"
      ? `
    width: 1%;
    min-width: 11.5rem;
    padding-right: 0.75rem;
  `
      : `
    width: 1%;
  `)}
`;

export const Tr = styled.tr`
  &:not(:last-child) td {
    border-bottom: 1px solid #f1f5f9;
  }
`;

export const Td = styled.td<{ $layout?: TableLayout }>`
  padding: 0.4rem 0.3rem;
  color: #374151;
  vertical-align: middle;
  background: #ffffff;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ $layout }) =>
    $layout === "fit"
      ? `
    width: 1%;
    max-width: 14rem;
  `
      : `
    max-width: 28rem;
  `}
`;

export const ActionsCell = styled.td<{ $layout?: TableLayout }>`
  padding: 0.3rem 0.4rem;
  white-space: nowrap;
  width: 1%;
  vertical-align: middle;
  ${({ $layout }) =>
    $layout === "fit" &&
    `
    min-width: 11.5rem;
    padding-right: 0.75rem;
  `}
`;

export const ActionsGroup = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 0.35rem;
  align-items: center;
  min-height: 1.75rem;
`;

export const ActionButton = styled.button<{ variant?: "edit" | "delete" }>`
  appearance: none;
  border: 1px solid #e5e7eb;
  background: ${({ variant }) =>
    variant === "delete" ? "#fff1f2" : "#f9fafb"};
  color: ${({ variant }) => (variant === "delete" ? "#be123c" : "#0f2167")};
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.3rem 0.5rem;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    background: ${({ variant }) =>
      variant === "delete" ? "#ffe4e6" : "#eef2ff"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }
`;
