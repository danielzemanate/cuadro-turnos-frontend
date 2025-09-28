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
