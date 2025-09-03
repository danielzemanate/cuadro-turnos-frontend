export interface SpecialPermitApprover {
  id: number;
  nombre_completo: string;
  id_municipio: number | null;
  municipio: string;
}

export interface SpecialPermitApproversResponse {
  coordinadores: SpecialPermitApprover[];
}

export interface SpecialPermitOptionsResponse {
  cuadros: IScheduleData[];
}

export interface IScheduleData {
  id: number;
  anio: number;
  mes: number;
  tipo_personal_salud: string;
  municipio: string;
  label: string;
}

export interface ISpecialPermitOptionsParams {
  id_coordinador: number;
  anio?: number;
  id_tipo_personal_salud?: number;
}

export interface IDataCreateSpecialPermit {
  id_usuario: number;
  hasta: string;
  es_novedad: boolean;
  id_cuadro_mes: number;
  creado_por: number;
}
