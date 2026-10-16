import { t } from "i18next";
import { UnknownAction } from "redux";
import { VACATION_ALERTS_PAGE_SIZE } from "../../constants/vacations.constants";
import {
  ICreateVacationPayload,
  IResolveVacationPayload,
  IVacationAlert,
  IVacationAlertsFilters,
  IVacationAlertsResponse,
  IVacationListFilters,
  IVacationListResponse,
  IVacationOperationResponse,
  IVacationOptions,
  IVacationRequest,
} from "../../interfaces/vacations";
import VacationsService from "../../services/vacations/vacations.service";
import { ThunkResult } from "../../types/types";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";

const backendMessage = (error: unknown): string => {
  const detail = (error as { response?: { data?: { detail?: unknown } } })
    ?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return "";
      })
      .map((message) => message.replace(/^Value error,\s*/i, "").trim())
      .filter(Boolean);
    if (messages.length) return messages.join(". ");
  }
  return t("alerts.genericError");
};

const toastError = (
  dispatch: (_action: UnknownAction) => void,
  error: unknown,
) => {
  dispatch(setOpenToast(true));
  dispatch(setVariantToast("error"));
  dispatch(setMessageToast(backendMessage(error)));
};

const toastSuccess = (
  dispatch: (_action: UnknownAction) => void,
  message: string,
) => {
  dispatch(setOpenToast(true));
  dispatch(setVariantToast("success"));
  dispatch(setMessageToast(message));
};

const accessTokenFrom = (
  getState: () => { user?: { userData?: { access_token?: string } | null } },
) => getState().user?.userData?.access_token ?? "";

export const fetchVacationOptions = (): ThunkResult<
  Promise<IVacationOptions | null>
> => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const response = await VacationsService.getOptions(
        accessTokenFrom(getState),
      );
      if (response.status === 200) {
        return response.data as IVacationOptions;
      }
      return null;
    } catch (error) {
      toastError(dispatch, error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchVacations = (
  filters: IVacationListFilters,
): ThunkResult<Promise<IVacationListResponse | null>> => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const response = await VacationsService.getVacations(
        filters,
        accessTokenFrom(getState),
      );
      if (response.status === 200) {
        return response.data as IVacationListResponse;
      }
      return null;
    } catch (error) {
      toastError(dispatch, error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchVacationById = (
  solicitudId: number,
): ThunkResult<Promise<IVacationRequest | null>> => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const response = await VacationsService.getVacation(
        solicitudId,
        accessTokenFrom(getState),
      );
      if (response.status === 200) {
        return response.data as IVacationRequest;
      }
      return null;
    } catch (error) {
      toastError(dispatch, error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const createVacation = (
  data: ICreateVacationPayload,
): ThunkResult<Promise<boolean>> => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const response = await VacationsService.createVacation(
        data,
        accessTokenFrom(getState),
      );
      if (response.status === 200 || response.status === 201) {
        toastSuccess(dispatch, t("vacations.create.success"));
        return true;
      }
      return false;
    } catch (error) {
      toastError(dispatch, error);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const resolveVacation = (
  solicitudId: number,
  data: IResolveVacationPayload,
): ThunkResult<Promise<IVacationRequest | null>> => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const response = await VacationsService.resolveVacation(
        solicitudId,
        data,
        accessTokenFrom(getState),
      );
      if (response.status === 200 || response.status === 201) {
        const body = response.data as IVacationOperationResponse;
        toastSuccess(
          dispatch,
          data.estado === "APROBADA"
            ? t("vacations.resolve.approved")
            : t("vacations.resolve.rejected"),
        );
        return body.solicitud;
      }
      return null;
    } catch (error) {
      toastError(dispatch, error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const fetchAllVacationAlerts = (
  filters: Omit<IVacationAlertsFilters, "page" | "page_size">,
): ThunkResult<Promise<IVacationAlert[] | null>> => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const token = accessTokenFrom(getState);
      const first = await VacationsService.getAlerts(
        { ...filters, page: 1, page_size: VACATION_ALERTS_PAGE_SIZE },
        token,
      );
      if (first.status !== 200) return null;
      const firstPage = first.data as IVacationAlertsResponse;
      const items = [...firstPage.items];
      const pageSize = Math.max(firstPage.page_size, 1);
      const pages = Math.ceil(firstPage.total / pageSize);
      for (let page = 2; page <= pages; page += 1) {
        const next = await VacationsService.getAlerts(
          { ...filters, page, page_size: VACATION_ALERTS_PAGE_SIZE },
          token,
        );
        if (next.status === 200) {
          items.push(...(next.data as IVacationAlertsResponse).items);
        }
      }
      return items;
    } catch (error) {
      toastError(dispatch, error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
