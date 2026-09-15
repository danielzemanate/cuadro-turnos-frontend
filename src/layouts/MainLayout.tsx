import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Content, Layout } from "./LayoutStyled";
import { IChildrenProps } from "../interfaces/shared";
import HeaderComponent from "../components/Header/Header";
import { useLocation } from "react-router-dom";
import Toast from "../components/Shared/Toast/Toast";
import OfflineBanner from "../components/Shared/OfflineBanner/OfflineBanner";
import ConfirmDialog from "../components/Common/confirmDialog/ConfirmDialog";
import { AppState } from "../redux/reducers/rootReducer";
import { useSelector } from "react-redux";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import { SESSION_STAY_MODAL_MINUTES } from "../constants/session.constants";

const MainLayout: FC<IChildrenProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { userData } = useSelector((state: AppState) => state.user);
  const isOnline = useNetworkStatus();
  const { warningOpen, secondsLeft, stay, leave } = useSessionTimeout();
  const hideLayoutForPaths = ["/", "/login"];

  const showHeader =
    userData?.user && !hideLayoutForPaths.includes(location.pathname);

  return (
    <Layout>
      {!isOnline && <OfflineBanner />}
      {showHeader && <HeaderComponent />}
      <Content>{children}</Content>
      <Toast />
      <ConfirmDialog
        open={warningOpen}
        title={t("session.title")}
        description={
          <>
            <p style={{ margin: "0 0 0.5rem" }}>
              {t("session.description", {
                minutes: SESSION_STAY_MODAL_MINUTES,
              })}
            </p>
            <p style={{ margin: 0 }}>
              {t("session.countdown", { seconds: secondsLeft })}
            </p>
          </>
        }
        confirmText={t("session.stay")}
        cancelText={t("session.leave")}
        onConfirm={stay}
        onCancel={leave}
      />
    </Layout>
  );
};

export default MainLayout;
