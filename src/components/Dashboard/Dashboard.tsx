import React, { FC } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { User } from "../../types/types";
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

interface DashboardProps {
  user: User;
}

const Dashboard: FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const allowedModules = filterModulesByRole(MODULES, user.rol);
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
              <ArrowLeft />
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
