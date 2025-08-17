import { ISignInValues } from "../../interfaces/signIn";
import { IUserInfo } from "../../interfaces/user";
import AuthService from "../../services/auth/auth";
import { constants, ThunkResult } from "../../types/types";
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
      dispatch(setMessageToast(t(`alerts.credentialsError`)));
      console.log(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const setUserInfo = (user: IUserInfo | null) => ({
  type: constants.setUserInfo,
  payload: user,
});
