import MainLayout from "../layouts/MainLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import Login from "../components/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import { MODULES } from "../config/modules";
import { Module } from "../types/types";
import HomePage from "../pages/HomePage/HomePage";

const getModuleRoutes = (modules: Module[]): (ReactNode | null)[] => {
  return modules.map((module, key) => {
    if (!module.component || !module.path) return null;

    const Component = module.component;
    const path = module.path.replace("/dashboard/", "");

    return <Route key={key} path={path} element={<Component />} />;
  });
};
const user = { id: 1, nombre: "Coodinador Test", rol: "Coordinador" };
const WebSiteAppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute isAllowed={!!user}>
              <HomePage user={user} />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage user={user} />} />
          {getModuleRoutes(MODULES)}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Si ponen una ruta no existente */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </MainLayout>
  );
};

export default WebSiteAppRouter;
