import {
  IConfigAttentionTypes,
  IDataUserRol,
  IFetchContractUserFilters,
  IFetchUsersFilters,
  IPersonalType,
  IUserContract,
} from "../../interfaces/administration";
import { IUserRegister } from "../../interfaces/signIn";
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
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/roles/${id}`,
    );
  },

  fetchMunicipios: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/municipios`,
    );
  },

  // =============== USUARIOS ===============
  fetchUsers: async (data: IFetchUsersFilters) => {
    // Filtra los campos que sean null o undefined
    const filteredParams = Object.fromEntries(
      Object.entries({
        municipio: data.municipio,
        tipo_personal: data.tipo_personal,
        activos: data.activos,
      }).filter(([, value]) => value !== null && value !== undefined),
    );

    const params = new URLSearchParams(filteredParams);

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}api/config/usuarios-detalle?${params}`,
    );
  },

  deleteUsers: async (id: string) => {
    return await api.delete(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/usuarios/${id}`,
    );
  },
  updateUser: async (data: Partial<IUserRegister>, id: string) => {
    return await api.put(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/usuarios/${id}`,
      data,
    );
  },

  // =============== CONTRATOS USUARIOS ===============
  fetchUserContract: async (data: IFetchContractUserFilters) => {
    // Filtra los campos que sean null o undefined
    const filteredParams = Object.fromEntries(
      Object.entries({
        id_usuario: data.id_usuario,
      }).filter(([, value]) => value !== null && value !== undefined),
    );

    const params = new URLSearchParams(filteredParams);

    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/contrato/listar?${params}`,
    );
  },

  fetchContractsTypes: async () => {
    return await api.get(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/contrato/tipos`,
    );
  },

  createUserContractlTypes: async (data: Partial<IUserContract>) => {
    return await api.post(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/contrato/crear`,
      data,
    );
  },

  deletetUserContract: async (id: string) => {
    return await api.delete(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/contrato/${id}`,
    );
  },
  updateUserContract: async (data: Partial<IUserContract>, id: string) => {
    return await api.put(
      `${import.meta.env.VITE_APP_BACK_ESE}auth/contrato/${id}`,
      data,
    );
  },
};

export default AdministrationService;
