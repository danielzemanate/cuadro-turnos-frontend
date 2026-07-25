import { t } from "i18next";
import { ThunkResult } from "../../types/types";
import {
  IAppointmentsFilters,
  IAppointmentsListResponse,
  ICancelAppointmentPayload,
  ICreateAppointmentPayload,
  IRescheduleAppointmentPayload,
} from "../../interfaces/appointments";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import AppointmentsService from "../../services/appointments/appointments.service";

export const fetchAppointments = (
  filters: IAppointmentsFilters,
): ThunkResult<Promise<IAppointmentsListResponse | null>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AppointmentsService.getAppointments(filters);
      if (response.status === 200) {
        return response.data as IAppointmentsListResponse;
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

export const createAppointment = (
  data: ICreateAppointmentPayload,
): ThunkResult<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AppointmentsService.createAppointment(data);
      if (response.status === 200 || response.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("alerts.createSuccess")));
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

export const cancelAppointment = (
  citaId: number,
  data: ICancelAppointmentPayload,
): ThunkResult<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AppointmentsService.cancelAppointment(
        citaId,
        data,
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("appointments.cancel.success")));
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

export const rescheduleAppointment = (
  citaId: number,
  data: IRescheduleAppointmentPayload,
): ThunkResult<Promise<boolean>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await AppointmentsService.rescheduleAppointment(
        citaId,
        data,
      );
      if (response.status === 200 || response.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("appointments.reschedule.success")));
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
