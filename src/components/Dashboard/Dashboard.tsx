import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Home } from "lucide-react";
import { MODULES } from "../../config/modules";
import { filterModulesByRole } from "../../utils/permissions";
import {
  DashboardContainer,
  MainContent,
  ModulesGrid,
  ModuleCard,
  ModuleIcon,
  ModuleName,
  BackButtonContainer,
  BackButton,
} from "./DashboardStyles";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers/rootReducer";
import {
  clearScheduleMonth,
  clearScheduleOptions,
} from "../../redux/actions/scheduleActions";
import { useAppDispatchThunk } from "../../hooks/storeHooks";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state: AppState) => state.user);
  const dispatchThunk = useAppDispatchThunk();

  const allowedModules = filterModulesByRole(MODULES, userData.roles.id);
  const isOnDashboardHome = location.pathname === "/dashboard";

  const handleModuleClick = (moduleId: number) => {
    const module = MODULES.find((m) => m.id === moduleId);
    if (module?.path) {
      navigate(module.path);
    }
  };

  const handleBackToDashboard = () => {
    // Limpia al usar el botón
    dispatchThunk(clearScheduleMonth());
    dispatchThunk(clearScheduleOptions());
    navigate("/dashboard");
  };

  // Limpia cada vez que entras a /dashboard (incluye primer render si ya estás allí)
  useEffect(() => {
    if (isOnDashboardHome) {
      dispatchThunk(clearScheduleMonth());
      dispatchThunk(clearScheduleOptions());
    }
  }, [isOnDashboardHome, dispatchThunk]);

  if (!isOnDashboardHome) {
    return (
      <DashboardContainer>
        <MainContent>
          <BackButtonContainer>
            <BackButton onClick={handleBackToDashboard}>
              <Home />
            </BackButton>
          </BackButtonContainer>
          <Outlet />
        </MainContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <MainContent>
        <ModulesGrid>
          {allowedModules.map((module) => (
            <ModuleCard
              key={module.id}
              bgColor={module.bgColor}
              hoverColor={module.hoverColor}
              onClick={() => handleModuleClick(module.id)}
            >
              <ModuleIcon>{React.createElement(module.icon)}</ModuleIcon>
              <ModuleName>{module.name}</ModuleName>
            </ModuleCard>
          ))}
        </ModulesGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
