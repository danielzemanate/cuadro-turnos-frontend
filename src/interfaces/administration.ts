export interface IConfigAttentionTypes {
  id: number;
  nombre: string;
  sigla: string;
  horas: number;
  id_tipo_personal_salud: number;
}

export interface IPersonalType {
  id: number;
  nombre: string;
}
export interface IDataUserRol {
  id_usuario: number;
  id_rol: number;
}

export interface IMunicipio {
  id: number;
  nombre: string;
}

export interface IUserListItem {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  id_tipo_personal_salud: number;
  id_municipio: number;
  activo: boolean;
  es_personal_salud: boolean;
  id_rol: number | null;
  rol_nombre: string | null;
}

export interface IFetchUsersFilters {
  municipio?: string;
  tipo_personal?: string;
  activos?: string;
}

export interface IFetchContractUserFilters {
  id_usuario?: string;
}

export interface IUserContract {
  id_usuario: number;
  id_tipo_contrato: number;
  n_contrato: number;
  fecha_inicio: string;
  fecha_fin: string;
  salario_mes: string;
  id: number;
  tipo_contrato_nombre: string;
  usuario_nombre: string;
  usuario_apellidos: string;
}

export interface IGenericGetData {
  id: number;
  nombre: string;
}
