import {
  IDataAddPatient,
  IDataAddUnmetDemand,
  IDataEditScheduleData,
  IParamsGenericQuery,
  IScheduleMonthParams,
} from "../../interfaces/schedule";
import api from "../../lib/api";

const ScheduleService = {
  getOptions: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/opciones`,
    );
  },
  getSchedulesByMonth: async (params: IScheduleMonthParams) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/cuadros-mes`,
      { params },
    );
  },
  getEditableOptions: async (params: IParamsGenericQuery) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/opciones-editables`,
      { params },
    );
  },
  getAttentionTypes: async (params: IParamsGenericQuery) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/tipos-atencion`,
      { params },
    );
  },
  getEditScheduleDay: async (data: IDataEditScheduleData) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/editar-dia`,
      data,
    );
  },
  getTotalPatientsByMonth: async (id_month: string) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/registro-pacientes?id_cuadro_mes=${id_month}`,
    );
  },
  postAddPatients: async (data: IDataAddPatient) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/registro-pacientes`,
      data,
    );
  },
  getSiauTypes: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/tipos-siau`,
    );
  },
  getUnmetDemand: async (id_month: string) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/demanda-insatisfecha?id_cuadro_mes=${id_month}`,
    );
  },
  postUnmetDemand: async (data: IDataAddUnmetDemand) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/reportes/demanda-insatisfecha`,
      data,
    );
  },
};

export default ScheduleService;
