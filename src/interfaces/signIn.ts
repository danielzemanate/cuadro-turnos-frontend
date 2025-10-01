export interface ISignInValues {
  correo: string;
  password: string;
}

export interface IUserRegister {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  id_tipo_personal_salud: number;
  id_municipio: number;
  password?: string;
  creado_por: number;
  actualizado_por?: number;
}

export interface IDataChangePassword {
  id_usuario: number;
  old_password: string;
  new_password: string;
}

export interface IDataResetPassword {
  correo: string;
}
