export interface IScheduleMonthParams {
  anio: number;
  mes: number;
  id_tipo_personal_salud: number;
  id_municipio: number;
}

export interface IScheduleResponse {
  anio: number;
  mes: number;
  tipo_personal_salud: string;
  municipio: string;
  personal_de_salud: PersonalDeSalud[];
}

export interface PersonalDeSalud {
  id_cuadro_personal: number;
  id_usuario: number;
  nombre: string;
  apellidos: string;
  dias: Dia[];
  total_horas: number;
}

export interface Dia {
  num_dia: number;
  es_novedad: boolean;
  tipo_atencion: string | null;
  horas: number;
}

export interface IOptionsResponse {
  periodos: Periodo[];
  tipos_personal_salud: TipoPersonalSalud[];
  municipios: Municipio[];
}

export interface Periodo {
  anio: number;
  mes: number;
}

export interface TipoPersonalSalud {
  id: number;
  nombre: string;
}

export interface Municipio {
  id: number;
  nombre: string;
}

export interface DayBucket {
  normal?: Dia;
  novedades: Dia[];
}

export interface FormState {
  selectedPeriodo: Periodo | null;
  selectedTipo: number | null;
  selectedMunicipio: number | null;
}

export interface PeriodoLike {
  anio: number;
  mes: number;
}

export interface IParamsGenericQuery {
  [key: string]: string | number | boolean | undefined;
}

export interface IAttentionTypesResponse {
  id: number;
  nombre: string;
  sigla: string;
  horas: number;
}

export interface IDataEditScheduleData {
  id_cuadro_personal: number;
  dia: number;
  id_tipo_atencion: number;
  horas: number;
  es_novedad: boolean;
  justificacion?: string;
  editor_user_id: number;
}

export interface IDataAddPatient {
  id_usuario: number;
  id_cuadro_mes: number;
  dia: number;
  total_pacientes: number;
}

export interface IPatientsData {
  id: number;
  id_usuario: number;
  mes: number;
  dia: number;
  total_pacientes: number;
}

export interface ISiauTypesResponse {
  id: number;
  nombre: string;
}

export interface IDataAddUnmetDemand {
  id_usuario: number;
  id_cuadro_mes: number;
  dia: number;
  id_tipos_siau: number;
  valor: number;
}
