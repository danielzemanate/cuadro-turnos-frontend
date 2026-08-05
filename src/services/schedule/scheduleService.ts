import {
  IChangeSupportStaff,
  ICreateSupportStaff,
  IDataAddPatient,
  IDataAddUnmetDemand,
  IDataEditScheduleData,
  IDataEditScheduleDayInterval,
  IParamsGenericQuery,
  IScheduleMonthParams,
} from "../../interfaces/schedule";
import {
  SpecialPermitApproversResponse,
  SpecialPermitOptionsResponse,
} from "../../interfaces/users-config.interface";
import api from "../../lib/api";
import UsersConfigService from "../users-config/users-config.service";

/**
 * `GET cuadros-mes` no devuelve el id de BD. Lo resolvemos con
 * opciones-coordinadores + opciones-cuadros (mismo criterio que permisos especiales).
 */
export const resolveCuadroMesId = async (
  params: IScheduleMonthParams,
): Promise<number | null> => {
  try {
    const approversRes = await UsersConfigService.fetchSpecialPermitApprovers();
    const coordinators =
      (approversRes.data as SpecialPermitApproversResponse)?.coordinadores ??
      [];
    const coordinator = coordinators.find(
      (c) => c.id_municipio === params.id_municipio,
    );
    if (!coordinator) return null;

    const optionsRes = await UsersConfigService.fetchSpecialPermitOptions({
      id_coordinador: coordinator.id,
      anio: params.anio,
      id_tipo_personal_salud: params.id_tipo_personal_salud,
    });
    const cuadros =
      (optionsRes.data as SpecialPermitOptionsResponse)?.cuadros ?? [];
    const match = cuadros.find(
      (c) => c.anio === params.anio && c.mes === params.mes,
    );
    return match?.id ?? null;
  } catch {
    return null;
  }
};

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
  postEditScheduleDayInterval: async (data: IDataEditScheduleDayInterval) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/editar-dia-intervalo`,
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
  postCreateSupportStaff: async (data: ICreateSupportStaff) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/agregar-personal`,
      data,
    );
  },
  postChangeSupportStaff: async (data: IChangeSupportStaff) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/cambiar-personal`,
      data,
    );
  },
};

export default ScheduleService;
