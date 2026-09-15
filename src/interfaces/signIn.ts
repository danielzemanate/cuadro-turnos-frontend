export interface ISignInValues {
  correo: string;
  password: string;
}

export interface IUserRegister {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  id_tipo_personal_salud?: number | null;
  id_municipio?: number | null;
  es_personal_salud?: boolean;
  password?: string;
  creado_por: number;
  actualizado_por?: number;
  activo?: boolean;
}

export interface IDataChangePassword {
  id_usuario: number;
  old_password: string;
  new_password: string;
}

export interface IDataResetPassword {
  correo: string;
}
