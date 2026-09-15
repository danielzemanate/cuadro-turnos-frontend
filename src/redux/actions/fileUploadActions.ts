import { t } from "i18next";
import {
  FileUploadKind,
  ICargaConfirmacion,
  ICargaValidacion,
} from "../../interfaces/fileUpload";
import FileUploadService from "../../services/fileUpload/fileUpload.service";
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
  if (typeof detail === "string" && detail.trim()) return detail;
  return t("alerts.genericError");
};

export const validateActivePatientsFile = (
  origen: FileUploadKind,
  file: File,
): ThunkResult<Promise<ICargaValidacion | null>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await FileUploadService.validateCarga(origen, file);
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ICargaValidacion;
        dispatch(setOpenToast(true));
        if (data.valido && data.errores_bloqueantes === 0) {
          dispatch(setVariantToast("success"));
          dispatch(setMessageToast(t("fileUpload.validateSuccess")));
        } else {
          dispatch(setVariantToast("error"));
          dispatch(setMessageToast(t("fileUpload.validateFailed")));
        }
        return data;
      }
      return null;
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(backendMessage(error)));
      console.log((error as { message?: string })?.message || error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const confirmActivePatientsFile = (
  cargaId: string,
  tokenConfirmacion: string,
): ThunkResult<Promise<ICargaConfirmacion | null>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await FileUploadService.confirmCarga(cargaId, {
        token_confirmacion: tokenConfirmacion,
        confirmar_reemplazo: true,
      });
      if (response.status === 200 || response.status === 201) {
        dispatch(setOpenToast(true));
        dispatch(setVariantToast("success"));
        dispatch(setMessageToast(t("fileUpload.loadSuccess")));
        return response.data as ICargaConfirmacion;
      }
      return null;
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(setMessageToast(backendMessage(error)));
      console.log((error as { message?: string })?.message || error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
