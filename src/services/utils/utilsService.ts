import { AxiosResponse } from "axios";
import { IDownloadSchedule } from "../../interfaces/utils";
import api from "../../lib/api";

const UtilsService = {
  getDownloadSchedule: async (
    params: IDownloadSchedule,
  ): Promise<AxiosResponse<Blob>> => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/descargar`,
      {
        params,
        responseType: "blob", // clave para PDF
      },
    );
  },
};

export default UtilsService;
