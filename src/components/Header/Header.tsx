import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { User, Settings, ChevronDown, LogOut, BadgeInfo } from "lucide-react";
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
  ConfigLabel,
  DropdownMenu,
  DropdownItem,
} from "./HeaderStyles";
import { useNavigate } from "react-router-dom";
import { fetchAccountLabels } from "../../redux/actions/administrationActions";
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
  const roleName = userData?.roles?.nombre ?? "";
  const tipoId = userData?.user?.id_tipo_personal_salud ?? null;
  const municipioId = userData?.user?.id_municipio || null;
  const [tipoNombre, setTipoNombre] = useState("");
  const [municipioNombre, setMunicipioNombre] = useState("");

  useEffect(() => {
    if (!userData?.access_token || (!tipoId && !municipioId)) {
      setTipoNombre("");
      setMunicipioNombre("");
      return;
    }
    let cancelled = false;
    const loadLabels = async () => {
      const labels = await dispatchThunk(
        fetchAccountLabels(tipoId, municipioId),
      );
      if (cancelled) return;
      setTipoNombre(labels.tipoNombre);
      setMunicipioNombre(labels.municipioNombre);
    };
    loadLabels();
    return () => {
      cancelled = true;
    };
  }, [dispatchThunk, municipioId, tipoId, userData?.access_token]);

  const userSubtitle = [tipoNombre || roleName, municipioNombre]
    .filter(Boolean)
    .join(" · ");

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    dispatchThunk(logoutUser());
    navigate("/"); // vuelve al login
  };

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);

  const handleGoProfile = () => {
    setIsDropdownOpen(false);
    navigate("/dashboard/profile");
  };

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
            <User size={22} color="#ffffff" />
          </UserIcon>
          <UserDetails>
            <Greeting>{t("header.greeting")}</Greeting>
            <UserName>{userName || "—"}</UserName>
            <UserRole>{userSubtitle}</UserRole>
          </UserDetails>
        </UserInfo>

        <Separator />

        <ConfigSection>
          <ConfigButton
            onClick={toggleDropdown}
            aria-label={t("header.configuration")}
          >
            <Settings size={16} color="#6b7280" />
            <ConfigLabel>{t("header.configuration")}</ConfigLabel>
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
              <DropdownItem onClick={handleGoProfile}>
                <BadgeInfo size={16} color="#011e62" />
                {t("header.profile")}
              </DropdownItem>

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
