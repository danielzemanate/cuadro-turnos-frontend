import { t } from "i18next";
import UtilsService from "../../services/utils/utilsService";
import { ThunkResult } from "../../types/types";
import {
  setLoading,
  setMessageToast,
  setOpenToast,
  setVariantToast,
} from "./helpersActions";
import { IDownloadSchedule } from "../../interfaces/utils";

/**
 * Descargar cuadro turnos
 */
export const fetchDownloadSchedule = (
  params: IDownloadSchedule,
): ThunkResult<Promise<void>> => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await UtilsService.getDownloadSchedule(params);

      // Si el backend devuelve error JSON pero con 200 y blob, intenta detectarlo:
      if (res.headers["content-type"]?.includes("application/json")) {
        const text = await res.data.text();
        let msg = t("alerts.downloadError") as string;
        try {
          const json = JSON.parse(text);
          msg = json?.detail || json?.message || msg;
        } catch (parseError) {
          // JSON parsing failed, will use default error message
          console.debug("Failed to parse error response as JSON:", parseError);
        }

        throw new Error(msg);
      }

      // Arma el blob
      const contentType = res.headers["content-type"] || "application/pdf";
      const blob = new Blob([res.data], { type: contentType });

      // Intenta extraer el filename del header Content-Disposition
      let filename = "cuadro-turnos.pdf";
      const dispo = res.headers["content-disposition"];
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
    } catch (error) {
      dispatch(setOpenToast(true));
      dispatch(setVariantToast("error"));
      dispatch(
        setMessageToast(
          error?.message || (t("alerts.downloadError") as string),
        ),
      );
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};
