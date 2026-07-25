import { t } from "i18next";
import { ThunkResult, constants } from "../../types/types";
import {
  IOptionsResponse,
  IScheduleResponse,
  IScheduleMonthParams,
  IParamsGenericQuery,
  IAttentionTypesResponse,
  IDataEditScheduleData,
  IDataEditScheduleDayInterval,
  IScheduleDayInterval,
  IDataAddPatient,
  ISiauTypesResponse,
  IDataAddUnmetDemand,
  IChangeSupportStaff,
  ICreateSupportStaff,
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
      // 404 significa que no hay cuadro para esos filtros: es un resultado
      // vacío, no un fallo. El componente muestra el estado "sin datos".
      if (error?.response?.status === 404) {
        dispatch({ type: constants.scheduleClearMonth });
        return;
      }
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
 * Edita un día del cuadro de turnos.
 * Retorna `id_cuadro_dia` de la respuesta (necesario para intervalos CE/CEC/CED).
 */
export const editScheduleDay = (
  data: IDataEditScheduleData,
  options?: { silent?: boolean },
): ThunkResult<Promise<number | null>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getEditScheduleDay(data);
      if (response.status === 200 || response.status === 201) {
        const idCuadroDia =
          response.data?.id_cuadro_dia ?? response.data?.id ?? null;

        if (!options?.silent) {
          dispatch(setOpenToast(true));
          dispatch(setVariantToast("success"));
          dispatch(setMessageToast(t("alerts.updateSuccess")));
        }
        return typeof idCuadroDia === "number" ? idCuadroDia : null;
      }
      return null;
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Guarda intervalos horarios de un día (tras editar-dia con CE/CEC/CED).
 */
export const editScheduleDayInterval = (
  data: IDataEditScheduleDayInterval,
): ThunkResult<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.postEditScheduleDayInterval(data);
      if (response.status === 200 || response.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
        return true;
      }
      return false;
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/**
 * Edita el día y luego guarda el intervalo horario (flujo CE/CEC/CED).
 * Si falla el intervalo, el día ya pudo haberse guardado en el backend.
 */
export const editScheduleDayWithInterval = (
  dayData: IDataEditScheduleData,
  intervalos: IScheduleDayInterval[],
): ThunkResult<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const dayResponse = await ScheduleService.getEditScheduleDay(dayData);
      if (dayResponse.status !== 200 && dayResponse.status !== 201) {
        return false;
      }

      const idCuadroDia =
        dayResponse.data?.id_cuadro_dia ?? dayResponse.data?.id ?? null;

      if (typeof idCuadroDia !== "number") {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("error"));
        dispatch(setMessageToast(t("scheduleViewer.interval.missingDayId")));
        return false;
      }

      const intervalResponse =
        await ScheduleService.postEditScheduleDayInterval({
          id_cuadro_dia: idCuadroDia,
          intervalos,
        });

      if (intervalResponse.status === 200 || intervalResponse.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.updateSuccess")));
        return true;
      }
      return false;
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(t("alerts.genericError")));
      console.log(error?.message || error);
      return false;
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
 * Obtiene los tipos de siau
 */
export const fetchSiauTypes = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getSiauTypes();
      if (response.status === 200) {
        const data = response.data as ISiauTypesResponse;
        dispatch({
          type: constants.scheduleSetSiauTypes,
          payload: data,
        });
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
 * Obtiene los valores de la demanda insatisfecha por tipo de siau
 */
export const fetchUnmetDemand = (
  id_cuadro_mes: string,
): ThunkResult<Promise<unknown>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.getUnmetDemand(id_cuadro_mes);
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
 * Agrega valor a la demanda insatisfecha por tipo de siau
 */
export const addUnmetDemand = (
  data: IDataAddUnmetDemand,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.postUnmetDemand(data);
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
 * Agrega personal de apoyo al cuadro de turnos
 */
export const createSupportStaff = (
  data: ICreateSupportStaff,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.postCreateSupportStaff(data);

      // Normalmente el backend responde 200 o 201 en creación
      if (response.status === 200 || response.status === 201) {
        // Si luego necesitas guardar data en store, aquí lo haces:
        // dispatch({ type: constants.scheduleCreateSupportStaff, payload: response.data });

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
 * Cambia (reemplaza/actualiza) personal de apoyo en el cuadro de turnos
 */
export const changeSupportStaff = (
  data: IChangeSupportStaff,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ScheduleService.postChangeSupportStaff(data);

      if (response.status === 200) {
        // Si luego necesitas guardar data en store, aquí lo haces:
        // dispatch({ type: constants.scheduleChangeSupportStaff, payload: response.data });

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

/**
 * Limpia datos del cuadro del mes tipos de siau
 */
export const clearSiauTypes = () => ({
  type: constants.scheduleClearSiauTypes,
});
