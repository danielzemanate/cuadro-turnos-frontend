import { t } from "i18next";
import { ThunkResult, constants } from "../../types/types";
import {
  IOptionsResponse,
  IScheduleResponse,
  IScheduleMonthParams,
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
