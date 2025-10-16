import { t } from "i18next";
import { ThunkResult, constants } from "../../types/types";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import {
  IReportPatientsRegisterData,
  IReportTypes,
  ISubReportTypes,
} from "../../interfaces/reports";
import ReportsService from "../../services/reports/reports.service";

/**
 * Carga lista de tipos de reporte
 */
export const fetchReportTypes = (): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ReportsService.fetchReportTypes();
      if (response.status === 200) {
        const data = response.data as IReportTypes[];
        dispatch({
          type: constants.reportsSetTypes,
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
 * Carga lista de subtipos por tipo de reporte
 */
export const fetchReportSubTypes = (
  id_report_type: string,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await ReportsService.fetchReportSubTypes(id_report_type);
      if (response.status === 200) {
        const data = response.data as ISubReportTypes[];
        dispatch({
          type: constants.reportsSetSubTypes,
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

// Action para descargar el reporte de registro de pacientes
export const fetchDownloadReportPatientsRegister = (
  params: IReportPatientsRegisterData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportPatientsRegister(params);

      // Si el backend devuelve error JSON pero con 200 y blob, intenta detectarlo:
      if (res.headers?.["content-type"]?.includes("application/json")) {
        const text = await res.data.text();
        let msg = t("alerts.downloadError") as string;
        try {
          const json = JSON.parse(text);
          msg = json?.detail || json?.message || msg;
        } catch (parseError) {
          console.debug("Failed to parse error response as JSON:", parseError);
        }
        throw new Error(msg);
      }

      // Arma el blob
      const contentType = res.headers?.["content-type"] || "application/pdf";
      const blob = new Blob([res.data], { type: contentType });

      // Intenta extraer el filename del header Content-Disposition
      let filename = `reporte-pacientes-${params.anio}-${params.mes}.pdf`;
      const dispo = res.headers?.["content-disposition"];
      if (dispo) {
        const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(
          dispo,
        );
        if (match?.[1]) filename = decodeURIComponent(match[1]);
      }

      // Descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Toast de éxito
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("success"));
      dispatch(setMessageToast(t("alerts.downloadSuccess") as string));
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(
        setMessageToast(
          error?.message || (t("alerts.downloadError") as string),
        ),
      );
      console.error("Error downloading report:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

/** Limpia tipos de reporte (útil en logout o cambio de contexto) */
export const clearReportTypes = () => ({
  type: constants.reportsClearTypes,
});

/** Limpia subtipos de reporte (útil cuando cambia el tipo seleccionado o en logout) */
export const clearReportSubTypes = () => ({
  type: constants.reportsClearSubTypes,
});
