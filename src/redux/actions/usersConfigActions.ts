import { constants, ThunkResult } from "./../../types/types";
import { t } from "i18next";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import UsersConfigService from "../../services/users-config/users-config.service";
import {
  IDataCreateSpecialPermit,
  ISpecialPermitOptionsParams,
  SpecialPermitApprover,
  SpecialPermitApproversResponse,
  SpecialPermitOptionsResponse,
} from "../../interfaces/users-config.interface";

export const fetchSpecialPermitApprovers = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await UsersConfigService.fetchSpecialPermitApprovers();
      if (response.status === 200) {
        const data = response.data as SpecialPermitApproversResponse;
        const approvers: SpecialPermitApprover[] = data.coordinadores;
        dispatch({
          type: constants.usersConfigSetSpecialPermitApprovers,
          payload: approvers,
        });
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

/**
 * Retorna la data de la API y además (opcional) la guarda en store.
 */
export const fetchSpecialPermitOptions = (
  params: ISpecialPermitOptionsParams,
): ThunkResult<Promise<SpecialPermitOptionsResponse | Error>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response =
        await UsersConfigService.fetchSpecialPermitOptions(params);
      if (response.status === 200) {
        const data = response.data as SpecialPermitOptionsResponse;
        return data;
      }
      return null;
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);

      // Retornamos el error
      return error instanceof Error
        ? error
        : new Error(error?.message || "Unknown error");
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Crea un permiso especial
 */
export const createSpecialPermit = (
  data: IDataCreateSpecialPermit,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await UsersConfigService.createSpecialPermit(data);
      if (response.status === 200) {
        // Despachar algo si se requiere guardar en el store
        // dispatch({ type: constants.scheduleUpdateDay, payload: response.data });

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

export const clearSpecialPermitApprovers = () => ({
  type: constants.usersConfigClearSpecialPermitApprovers,
});
