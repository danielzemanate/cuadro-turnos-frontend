// src/router/WebSiteAppRouter.tsx
import MainLayout from "../layouts/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import { MODULES } from "../config/modules";
import { Module } from "../types/types";
import HomePage from "../pages/HomePage/HomePage";
import { useSelector } from "react-redux";
import { AppState } from "../redux/reducers/rootReducer";
import RequireModuleAccess from "./RequireModuleAccess";
import Profile from "../components/Profile/Profile";

const getModuleRoutes = (modules: Module[]) =>
  modules.map((module, key) => {
    if (!module.component || !module.path) return null;
    const Component = module.component;
    const path = module.path.replace("/dashboard/", "");
    return (
      <Route
        key={key}
        path={path}
        element={
          // Guard de módulos SOLO para módulos
          <RequireModuleAccess>
            <Component />
          </RequireModuleAccess>
        }
      />
    );
  });

const WebSiteAppRouter = () => {
  const { userData } = useSelector((state: AppState) => state.user);
  const isAuth = !!userData?.access_token;

  return (
    <MainLayout>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Login />} />

        {/* Protegido por autenticación */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute isAllowed={isAuth}>
              {/* OJO: SIN RequireModuleAccess aquí */}
              <HomePage />
            </ProtectedRoute>
          }
        >
          {/* Home del dashboard */}
          <Route index element={<HomePage />} />

          {/* Perfil: sin guard de módulos */}
          <Route path="profile" element={<Profile />} />

          {/* Módulos con guard de módulos */}
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
