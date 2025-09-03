import {
  IDataCreateSpecialPermit,
  ISpecialPermitOptionsParams,
} from "../../interfaces/users-config.interface";
import api from "../../lib/api";

const UsersConfigService = {
  fetchSpecialPermitApprovers: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/permisos-especiales/opciones-coordinadores`,
    );
  },
  fetchSpecialPermitOptions: async (params: ISpecialPermitOptionsParams) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/permisos-especiales/opciones-cuadros`,
      { params },
    );
  },
  createSpecialPermit: async (data: IDataCreateSpecialPermit) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/cuadros/permisos-especiales`,
      data,
    );
  },
};

export default UsersConfigService;
