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
