import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MODULES } from "../../../config/modules";
import { getModuleByPath } from "../../../utils/permissions";
import {
  BreadcrumbNav,
  CrumbButton,
  CrumbCurrent,
  CrumbSeparator,
} from "./BreadcrumbStyles";

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

type Props = {
  /** Si se omite, se resuelve desde la ruta actual + MODULES */
  items?: BreadcrumbItem[];
  onNavigateHome?: () => void;
};

const resolveItemsFromPath = (
  pathname: string,
  homeLabel: string,
  profileLabel: string,
): BreadcrumbItem[] => {
  const home: BreadcrumbItem = { label: homeLabel, path: "/dashboard" };

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return [home];
  }

  if (pathname === "/dashboard/profile") {
    return [home, { label: profileLabel }];
  }

  const module = getModuleByPath(MODULES, pathname);
  if (module) {
    return [home, { label: module.name }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "";
  return [home, { label: last }];
};

export const Breadcrumb: React.FC<Props> = ({ items, onNavigateHome }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const crumbs = useMemo(
    () =>
      items ??
      resolveItemsFromPath(
        location.pathname,
        t("breadcrumb.home"),
        t("breadcrumb.profile"),
      ),
    [items, location.pathname, t],
  );

  // En home del dashboard no tiene sentido mostrar solo "Inicio"
  if (crumbs.length < 2) return null;

  const handleClick = (path?: string) => {
    if (!path) return;
    if (path === "/dashboard" && onNavigateHome) {
      onNavigateHome();
      return;
    }
    navigate(path);
  };

  return (
    <BreadcrumbNav aria-label={t("breadcrumb.aria")}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && <CrumbSeparator aria-hidden>›</CrumbSeparator>}
            {isLast || !crumb.path ? (
              <CrumbCurrent aria-current="page">{crumb.label}</CrumbCurrent>
            ) : (
              <CrumbButton
                type="button"
                onClick={() => handleClick(crumb.path)}
              >
                {crumb.label}
              </CrumbButton>
            )}
          </React.Fragment>
        );
      })}
    </BreadcrumbNav>
  );
};

export default Breadcrumb;
