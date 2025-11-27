import { Types } from "../types/types";

export interface IReportTypes {
  id: number;
  nombre: string;
}

export interface ISubReportTypes {
  id: number;
  nombre: string;
  id_tipo_reporte: number;
}

export interface IReportFiltersData {
  anio?: number;
  mes?: number;
  id_municipio: number;
  id_tipo_personal_salud?: number;
}

export interface IReportsActions {
  type: Types;
  payload?: IReportTypes | ISubReportTypes | null;
}
