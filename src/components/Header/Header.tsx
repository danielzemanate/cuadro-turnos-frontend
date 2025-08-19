import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { User, Settings, ChevronDown, LogOut } from "lucide-react";
import loginLogo from "../../assets/images/loginLogo.png";
import {
  Header,
  LogoSection,
  UserSection,
  UserInfo,
  UserIcon,
  UserDetails,
  Greeting,
  UserName,
  UserRole,
  Separator,
  ConfigSection,
  ConfigButton,
  DropdownMenu,
  DropdownItem,
} from "./HeaderStyles";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/actions/userActions";
import { AppState } from "../../redux/reducers/rootReducer";
import { useAppDispatchThunk } from "../../hooks/storeHooks";

const HeaderComponent: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatchThunk = useAppDispatchThunk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // toma el user desde Redux
  const { userData } = useSelector((state: AppState) => state.user);
  const userName =
    `${userData?.user?.nombre ?? ""} ${userData?.user?.apellidos ?? ""}`.trim();
  const userRole = userData?.roles.nombre;

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await dispatchThunk(logoutUser());
    navigate("/"); // vuelve al login
  };

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);

  return (
    <Header>
      <LogoSection
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <img src={loginLogo} alt="Logo E.S.E Suroccidente" />
      </LogoSection>

      <UserSection>
        <UserInfo>
          <UserIcon>
            <User size={25} color="#ffffff" />
          </UserIcon>
          <UserDetails>
            <Greeting>{t("header.greeting")}</Greeting>
            <UserName>{userName || "—"}</UserName>
            <UserRole>{userRole}</UserRole>
          </UserDetails>
        </UserInfo>

        <Separator />

        <ConfigSection>
          <ConfigButton onClick={toggleDropdown}>
            <Settings size={16} color="#6b7280" />
            {t("header.configuration")}
            <ChevronDown
              size={16}
              color="#6b7280"
              style={{
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </ConfigButton>
          {isDropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={handleLogout}>
                <LogOut size={16} color="#011e62" />
                {t("header.logout")}
              </DropdownItem>
            </DropdownMenu>
          )}
        </ConfigSection>
      </UserSection>
    </Header>
  );
};

export default HeaderComponent;
