import React from "react";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state: AppState) => state.user);

  const allowedModules = filterModulesByRole(MODULES, userData.roles.id);
  const isOnDashboardHome = location.pathname === "/dashboard";

  const handleModuleClick = (moduleId: number) => {
    const module = MODULES.find((m) => m.id === moduleId);
    if (module?.path) {
      navigate(module.path);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

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
