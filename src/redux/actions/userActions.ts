import {
  IDataChangePassword,
  IDataResetPassword,
  ISignInValues,
  IUserRegister,
} from "../../interfaces/signIn";
import { IResponseRegister, IUserInfo } from "../../interfaces/user";
import AuthService from "../../services/auth/auth";
import { constants, ThunkResult } from "../../types/types";
import { persistor } from "../store/store";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import { t } from "i18next";

export const loginUser =
  (data: ISignInValues): ThunkResult<Promise<void>> =>
  async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.login(data);
      if (response.status === 200) {
        const responseData = response.data as IUserInfo;
        dispatch(setUserInfo(responseData));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.credentialsError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const setUserInfo = (user: IUserInfo | null) => ({
  type: constants.setUserInfo,
  payload: user,
});

// Logout
export const logoutUser = (): ThunkResult<void> => async (dispatch) => {
  try {
    dispatch({ type: constants.logoutUser });

    // opcional: limpia TODO el persist store
    await persistor.purge();
  } catch (error) {
    console.log(error?.message || error);
    // Si falla algo, limpia el slice
    dispatch({ type: constants.logoutUser });
  }
};

// Register
export const registerUser = (
  data: IUserRegister,
): ThunkResult<
  Promise<{ success: boolean; status: number; data: IResponseRegister | null }>
> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.register(data);

      if (response.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.createSuccess")));
      }
      return { success: true, status: 200, data: response.data };
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      const errorMessage = error?.response?.data?.detail
        ? t(error.response.data.detail)
        : t("alerts.genericError");
      dispatch(setMessageToast(errorMessage));
      console.error(error?.message || error);
      return {
        success: false,
        status: error?.response?.status || 500,
        data: null,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// Change password
export const FetchChangePassword = (
  data: IDataChangePassword,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.changePassword(data);
      if (response.status === 200 || response.status === 204) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
        dispatch(logoutUser());
        return; // éxito
      }
      // por si acaso
      throw new Error(t("alerts.genericError"));
    } catch (error) {
      // Lee el detalle del backend (Axios: error.response.data.detail)
      const backendMsg =
        error?.response?.data?.detail ||
        error?.message ||
        t("alerts.genericError");

      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(backendMsg));

      // Re-lanza para que el componente pueda reaccionar (mostrar inline)
      throw new Error(backendMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };
};
// Reset password
export const FetchResetPassword = (
  data: IDataResetPassword,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.resetPassword(data);
      if (response.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.requestSuccess")));
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};
