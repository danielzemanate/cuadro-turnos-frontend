import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PageButton,
  PaginationBar,
  PaginationControls,
  PaginationInfo,
  PerPageSelect,
} from "./PaginationStyles";

type Props = {
  page: number;
  perPage: number;
  total: number;
  perPageOptions?: number[];
  onPageChange: (_page: number) => void;
  onPerPageChange?: (_perPage: number) => void;
  disabled?: boolean;
};

const buildPageItems = (
  current: number,
  totalPages: number,
): Array<number | "ellipsis"> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
};

export const Pagination: React.FC<Props> = ({
  page,
  perPage,
  total,
  perPageOptions = [10, 20, 50],
  onPageChange,
  onPerPageChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / Math.max(perPage, 1)));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to = Math.min(safePage * perPage, total);
  const pages = useMemo(
    () => buildPageItems(safePage, totalPages),
    [safePage, totalPages],
  );

  return (
    <PaginationBar>
      <PaginationInfo>
        {t("pagination.showing", { from, to, total })}
      </PaginationInfo>

      <PaginationControls>
        {onPerPageChange && (
          <PerPageSelect
            aria-label={t("pagination.perPage")}
            value={perPage}
            disabled={disabled}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {t("pagination.perPageOption", { count: option })}
              </option>
            ))}
          </PerPageSelect>
        )}

        <PageButton
          type="button"
          disabled={disabled || safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label={t("pagination.previous")}
        >
          ‹
        </PageButton>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <PageButton key={`e-${index}`} type="button" disabled>
              …
            </PageButton>
          ) : (
            <PageButton
              key={item}
              type="button"
              $active={item === safePage}
              disabled={disabled}
              onClick={() => onPageChange(item)}
            >
              {item}
            </PageButton>
          ),
        )}

        <PageButton
          type="button"
          disabled={disabled || safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label={t("pagination.next")}
        >
          ›
        </PageButton>
      </PaginationControls>
    </PaginationBar>
  );
};

export default Pagination;
