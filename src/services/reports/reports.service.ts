import { AxiosResponse } from "axios";
import { IReportPatientsRegisterData } from "../../interfaces/reports";
import api from "../../lib/api";

const ReportsService = {
  fetchReportTypes: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/tipo-reporte`,
    );
  },
  fetchReportSubTypes: async (id_report_type: string) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/subtipo-reporte?id_tipo_reporte=${id_report_type}`,
    );
  },
  fetchReportPatientsRegister: async (
    data: IReportPatientsRegisterData,
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams({
      anio: data.anio.toString(),
      mes: data.mes.toString(),
      id_municipio: data.id_municipio.toString(),
      id_tipo_personal_salud: data.id_tipo_personal_salud.toString(),
    });

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/reporte/registro-pacientes.pdf?${params}`,
      {
        responseType: "blob",
      },
    );
  },
};

export default ReportsService;
