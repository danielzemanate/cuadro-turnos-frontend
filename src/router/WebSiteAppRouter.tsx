import MainLayout from "../layouts/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import Login from "../components/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import { MODULES } from "../config/modules";
import { Module } from "../types/types";
import HomePage from "../pages/HomePage/HomePage";
import { useSelector } from "react-redux";
import { AppState } from "../redux/reducers/rootReducer";

const getModuleRoutes = (modules: Module[]): (ReactNode | null)[] => {
  return modules.map((module, key) => {
    if (!module.component || !module.path) return null;
    const Component = module.component;
    const path = module.path.replace("/dashboard/", "");
    return <Route key={key} path={path} element={<Component />} />;
  });
};

const WebSiteAppRouter = () => {
  const { userData } = useSelector((state: AppState) => state.user);
  const isAuth = !!userData?.access_token;

  const headerUser = {
    id: userData?.user?.id ?? 0,
    nombre:
      `${userData?.user?.nombre ?? ""} ${userData?.user?.apellidos ?? ""}`.trim(),
    rol: userData?.roles?.[0] ?? "Coordinador",
  };

  return (
    <MainLayout>
      <Routes>
        {/* Login público */}
        <Route path="/" element={<Login />} />

        {/* Zona protegida */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute isAllowed={isAuth}>
              <HomePage user={headerUser} />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage user={headerUser} />} />
          {getModuleRoutes(MODULES)}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </MainLayout>
  );
};

export default WebSiteAppRouter;
