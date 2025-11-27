import { AxiosResponse } from "axios";
import { IReportFiltersData } from "../../interfaces/reports";
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
    data: IReportFiltersData,
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
  fetchReportMonthDetails: async (
    data: IReportFiltersData,
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams({
      anio: data.anio.toString(),
      mes: data.mes.toString(),
      id_municipio: data.id_municipio.toString(),
      id_tipo_personal_salud: data.id_tipo_personal_salud.toString(),
    });

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/reporte/mensual-detallado.pdf?${params}`,
      {
        responseType: "blob",
      },
    );
  },
  fetchReportAnualComparative: async (
    data: IReportFiltersData,
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams({
      anio: data.anio.toString(),
      id_municipio: data.id_municipio.toString(),
      id_tipo_personal_salud: data.id_tipo_personal_salud.toString(),
    });

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/reporte/comparativo-anual.pdf?${params}`,
      {
        responseType: "blob",
      },
    );
  },
  fetchReportCostDetail: async (
    data: IReportFiltersData,
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams({
      anio: data.anio.toString(),
      mes: data.mes.toString(),
      id_municipio: data.id_municipio.toString(),
      id_tipo_personal_salud: data.id_tipo_personal_salud.toString(),
    });

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/reporte/costo-detallado.pdf?${params}`,
      {
        responseType: "blob",
      },
    );
  },

  fetchReportCostMonth: async (
    data: IReportFiltersData,
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams({
      anio: data.anio.toString(),
      mes: data.mes.toString(),
      id_tipo_personal_salud: data.id_tipo_personal_salud.toString(),
    });

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/reporte/costo-comparativo-mensual.pdf?${params}`,
      {
        responseType: "blob",
      },
    );
  },

  fetchReportCostYear: async (
    data: IReportFiltersData,
  ): Promise<AxiosResponse<Blob>> => {
    const params = new URLSearchParams({
      anio: data.anio.toString(),
      id_municipio: data.id_municipio.toString(),
      id_tipo_personal_salud: data.id_tipo_personal_salud.toString(),
    });

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/reporte/costo-comparativo-anual.pdf?${params}`,
      {
        responseType: "blob",
      },
    );
  },
};

export default ReportsService;
