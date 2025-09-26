import { t } from "i18next";
import { ThunkResult, constants } from "../../types/types";
import {
  IOptionsResponse,
  IScheduleResponse,
  IScheduleMonthParams,
  IParamsGenericQuery,
  IAttentionTypesResponse,
  IDataEditScheduleData,
  IDataAddPatient,
} from "../../interfaces/schedule";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import ScheduleService from "../../services/schedule/scheduleService";

/**
 * Carga opciones (periodos, tipos de personal, municipios)
 */
export const fetchScheduleOptions = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getOptions();
      if (response.status === 200) {
        const data = response.data as IOptionsResponse;
        dispatch({
          type: constants.scheduleSetOptions,
          payload: data,
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
 * Carga cuadro de turnos por mes según los parámetros
 */
export const fetchScheduleByMonth = (
  params: IScheduleMonthParams,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getSchedulesByMonth(params);
      if (response.status === 200) {
        const data = response.data as IScheduleResponse;
        dispatch({
          type: constants.scheduleSetMonth,
          payload: data,
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
 * Carga opciones editables (según params genéricos de query)
 */
export const fetchEditableOptions = (
  params: IParamsGenericQuery,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getEditableOptions(params);
      if (response.status === 200) {
        const data = response.data as IOptionsResponse;
        dispatch({
          type: constants.scheduleSetEditableOptions,
          payload: data,
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
 * Carga tipos de atención (según params genéricos de query)
 */
export const fetchAttentionTypes = (
  params: IParamsGenericQuery,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getAttentionTypes(params);
      if (response.status === 200) {
        const data = response.data as IAttentionTypesResponse;
        dispatch({
          type: constants.scheduleSetAttentionTypes,
          payload: data,
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
 * Edita un día del cuadro de turnos
 */
export const editScheduleDay = (
  data: IDataEditScheduleData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getEditScheduleDay(data);
      if (response.status === 200) {
        // Despachar algo si se requiere guardar en el store
        // dispatch({ type: constants.scheduleUpdateDay, payload: response.data });

        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
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
 * Obtiene el total de pacientes por mes
 */
export const fetchTotalPatientsByMonth = (
  id_cuadro_mes: string,
): ThunkResult<Promise<unknown>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response =
        await ScheduleService.getTotalPatientsByMonth(id_cuadro_mes);
      if (response.status === 200) {
        // Retornar la respuesta para que el componente la pueda usar
        return response;
      }
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Agrega total pacientes a un día en el cuadro de turnos
 */
export const addPatients = (
  data: IDataAddPatient,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.postAddPatients(data);
      if (response.status === 200) {
        // Despachar algo si se requiere guardar en el store
        // dispatch({ type: constants.scheduleAddTotalPatients, payload: response.data });

        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
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
 * Limpia opciones del schedule (útil en logout o cambio de contexto)
 */
export const clearScheduleOptions = () => ({
  type: constants.scheduleClearOptions,
});

/**
 * Limpia datos del cuadro del mes (útil en logout o cambio de período)
 */
export const clearScheduleMonth = () => ({
  type: constants.scheduleClearMonth,
});

/**
 * Limpia opciones editables y tipos de atencion del schedule (útil en logout o cambio de contexto)
 */
export const clearEditableOptions = () => ({
  type: constants.scheduleClearEditableOptions,
});

export const clearAttentionTypes = () => ({
  type: constants.scheduleClearAttentionTypes,
});
