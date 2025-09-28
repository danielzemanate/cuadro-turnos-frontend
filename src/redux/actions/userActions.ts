import { ISignInValues, IUserRegister } from "../../interfaces/signIn";
import { IUserInfo } from "../../interfaces/user";
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
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.register(data);
      if (response.status === 200) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.createSuccess")));
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
