import {
  IConfigAttentionTypes,
  IDataUserRol,
  IPersonalType,
} from "../../interfaces/administration";
import { IRoles } from "../../interfaces/user";
import api from "../../lib/api";

const AdministrationService = {
  // ROLES
  fetchRoles: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles`,
    );
  },
  createRole: async (data: Partial<IRoles>) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles`,
      data,
    );
  },
  updateRole: async (data: Partial<IRoles>, id: string) => {
    return await api.put(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles/${id}`,
      data,
    );
  },
  deleteRole: async (id: string) => {
    return await api.delete(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles/${id}`,
    );
  },

  // TIPOS DE ATENCIÓN
  fetchConfigAttentionTypes: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-atencion`,
    );
  },
  createAttentionTypes: async (data: Partial<IConfigAttentionTypes>) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-atencion`,
      data,
    );
  },
  updateAttentionTypes: async (
    data: Partial<IConfigAttentionTypes>,
    id: string,
  ) => {
    return await api.put(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-atencion/${id}`,
      data,
    );
  },
  deleteAttentionTypes: async (id: string) => {
    return await api.delete(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-atencion/${id}`,
    );
  },

  // TIPOS DE PERSONAL DE SALUD (CATÁLOGO)
  fetchConfigPersonalTypes: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-personal-salud`,
    );
  },
  createPersonalTypes: async (data: Partial<IPersonalType>) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-personal-salud`,
      data,
    );
  },
  updatePersonalTypes: async (data: Partial<IPersonalType>, id: string) => {
    return await api.put(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-personal-salud/${id}`,
      data,
    );
  },
  deletePersonalTypes: async (id: string) => {
    return await api.delete(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-personal-salud/${id}`,
    );
  },

  // ROLES USUARIOS
  fetchUserRol: async (id_user: string) => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles/usuario/${id_user}`,
    );
  },
  updateUserRol: async (data: Partial<IDataUserRol>) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles/usuario`,
      data,
    );
  },
  deleteUserRol: async (id: string) => {
    return await api.delete(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/tipos-personal-salud/${id}`,
    );
  },
};

export default AdministrationService;
