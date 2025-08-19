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
