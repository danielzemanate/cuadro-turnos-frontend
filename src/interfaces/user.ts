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
}
