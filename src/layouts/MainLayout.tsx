import { FC } from "react";
import { Content, Layout } from "./LayoutStyled";
import { IChildrenProps } from "../interfaces/shared";
import HeaderComponent from "../components/Header/Header";
import { useLocation } from "react-router-dom";
import Toast from "../components/Shared/Toast/Toast";
import { AppState } from "../redux/reducers/rootReducer";
import { useSelector } from "react-redux";

const MainLayout: FC<IChildrenProps> = ({ children }) => {
  const location = useLocation();
  const { userData } = useSelector((state: AppState) => state.user);
  const hideLayoutForPaths = ["/", "/login"];

  const showHeader =
    userData?.user && !hideLayoutForPaths.includes(location.pathname);

  return (
    <Layout>
      {showHeader && <HeaderComponent />}
      <Content>{children}</Content>
      <Toast />
    </Layout>
  );
};

export default MainLayout;
