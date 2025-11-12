import { Types } from "../types/types";

export interface IUserActions {
  type: Types;
  payload?: IUserInfo | null;
}

export interface IUserState {
  userData: IUserInfo | null;
}

export interface IUserInfo {
  access_token: string;
  token_type: "bearer" | string;
  user: IUser;
  roles: IRoles;
}

export interface IRoles {
  id: number;
  nombre: string;
}

export interface IUser {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  id_tipo_personal_salud: number | null;
  id: number;
  activo: boolean;
  es_personal_salud: boolean;
  id_municipio: number;
}

export interface IContract {
  id: number;
  id_usuario: number;
  id_tipo_contrato: number;
  n_contrato: number;
  fecha_inicio: string;
  fecha_fin: string;
  salario_mes: string;
  tipo_contrato_nombre: string;
  usuario_nombre: string;
  usuario_apellidos: string;
}

export interface IContractForm {
  id_tipo_contrato: number;
  n_contrato: string;
  fecha_inicio: string;
  fecha_fin: string;
  salario_mes: string;
}

export interface IUserForm {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  id_tipo_personal_salud: number;
  id_municipio: number;
  activo: boolean;
  creado_por?: number;
  actualizado_por?: number;
}
