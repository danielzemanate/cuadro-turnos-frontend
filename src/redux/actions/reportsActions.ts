import { t } from "i18next";
import { ThunkResult, constants } from "../../types/types";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import {
  IReportFiltersData,
  IReportTypes,
  ISubReportTypes,
} from "../../interfaces/reports";
import ReportsService from "../../services/reports/reports.service";
import { AxiosResponse } from "axios";

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

// ===== Helpers internos para descarga de blob =====

const handleBlobDownload = async (
  res: AxiosResponse<Blob>,
  defaultFilename: string,
): Promise<string> => {
  const contentType = res.headers?.["content-type"] ?? "application/pdf";

  // Si el backend devuelve error JSON pero con 200 y blob, intenta detectarlo:
  if (contentType.includes("application/json")) {
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
  const blob = new Blob([res.data], { type: contentType });

  // Filename fallback
  let filename = defaultFilename;
  const dispo = res.headers?.["content-disposition"];
  if (dispo) {
    const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(dispo);
    if (match?.[1]) {
      filename = decodeURIComponent(match[1]);
    }
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

  return filename;
};

// ===== REPORTES DE DESCARGA =====

// 1. Reporte de registro de pacientes
export const fetchDownloadReportPatientsRegister = (
  params: IReportFiltersData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportPatientsRegister(params);

      const defaultFilename = `reporte-pacientes-${params.anio}-${params.mes}.pdf`;
      await handleBlobDownload(res, defaultFilename);

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
      console.error("Error downloading report registro pacientes:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// 2. Reporte mensual detallado
export const fetchDownloadReportMonthDetails = (
  params: IReportFiltersData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportMonthDetails(params);

      const defaultFilename = `reporte-mensual-detallado-${params.anio}-${params.mes}.pdf`;
      await handleBlobDownload(res, defaultFilename);

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
      console.error("Error downloading report mensual detallado:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// 3. Reporte comparativo anual (cantidad / registros)
export const fetchDownloadReportAnualComparative = (
  params: IReportFiltersData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportAnualComparative(params);

      const defaultFilename = `reporte-comparativo-anual-${params.anio}.pdf`;
      await handleBlobDownload(res, defaultFilename);

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
      console.error("Error downloading report comparativo anual:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// 4. Reporte costo detallado
export const fetchDownloadReportCostDetail = (
  params: IReportFiltersData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportCostDetail(params);

      const defaultFilename = `reporte-costo-detallado-${params.anio}-${params.mes}.pdf`;
      await handleBlobDownload(res, defaultFilename);

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
      console.error("Error downloading report costo detallado:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// 5. Reporte costo comparativo mensual
export const fetchDownloadReportCostMonth = (
  params: IReportFiltersData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportCostMonth(params);

      const defaultFilename = `reporte-costo-comparativo-mensual-${params.anio}-${params.mes}.pdf`;
      await handleBlobDownload(res, defaultFilename);

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
      console.error(
        "Error downloading report costo comparativo mensual:",
        error,
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// 6. Reporte costo comparativo anual
export const fetchDownloadReportCostYear = (
  params: IReportFiltersData,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await ReportsService.fetchReportCostYear(params);

      const defaultFilename = `reporte-costo-comparativo-anual-${params.anio}.pdf`;
      await handleBlobDownload(res, defaultFilename);

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
      console.error("Error downloading report costo comparativo anual:", error);
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
