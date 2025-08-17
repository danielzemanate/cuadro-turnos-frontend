import { FC, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { setOpenToast } from "../../../redux/actions/helpersActions";
import { ToastContainer, ToastWrapper } from "./ToastStyled";
import { AppState } from "../../../redux/reducers/rootReducer";
import { useAppDispatch } from "../../../hooks/storeHooks";

const Toast: FC = () => {
  const dispatch = useAppDispatch();
  const { openToast, messageToast, variantToast } = useSelector(
    (state: AppState) => state.helpers,
  );

  const showToastMessage = useCallback(() => {
    setTimeout(() => {
      dispatch(setOpenToast(false));
    }, 6000);
  }, [dispatch]);

  useEffect(() => {
    showToastMessage();
  }, [openToast, showToastMessage]);

  if (!openToast) return null;

  return (
    <ToastContainer>
      <ToastWrapper variant={variantToast}>{messageToast}</ToastWrapper>
    </ToastContainer>
  );
};

export default Toast;
