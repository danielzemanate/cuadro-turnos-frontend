import { Types } from "../types/types";

export interface IUserActions {
  type: Types;
  payload?: IUserInfo | null;
}

export interface IUserState {
  user: IUserInfo | null;
}

export interface IUserInfo {
  access_token: string;
  token_type: "bearer" | string;
  user: IUser;
  roles: string[];
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
}
