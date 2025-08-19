import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../redux/reducers/rootReducer";
import { MODULES } from "../config/modules";
import { getModuleByPath, hasPermission } from "../utils/permissions";

type Props = { children: ReactNode };

const RequireModuleAccess = ({ children }: Props) => {
  const location = useLocation();
  const { userData } = useSelector((state: AppState) => state.user);
  const userRoleId = userData?.roles?.id;

  const fullPath = location.pathname;
  const module = getModuleByPath(MODULES, fullPath);

  // Si la ruta no corresponde a un módulo declarado, redirije
  if (!module) return <>{children}</>;

  // Si no tiene rol para este módulo, 403 -> back al dashboard
  if (!hasPermission(module, userRoleId)) {
    return <Navigate to="/dashboard" replace state={{ denied: true }} />;
  }

  return <>{children}</>;
};

export default RequireModuleAccess;
