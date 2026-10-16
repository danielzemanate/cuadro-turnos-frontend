export type VacationStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export type VacationDecision = "APROBADA" | "RECHAZADA";

export type VacationScenario = "solo_aprobadas" | "proyeccion";

export type VacationLevel =
  | "SIN_PERSONAL"
  | "SIN_ALERTA"
  | "ADVERTENCIA"
  | "ALTO";

export interface IVacationRequest {
  id: number;
  id_usuario: number;
  nombre_usuario: string;
  id_municipio: number;
  nombre_municipio: string;
  id_tipo_personal_salud: number;
  nombre_tipo_personal_salud: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_calendario: number;
  estado: VacationStatus;
  observacion_solicitante: string | null;
  observacion_resolucion: string | null;
  id_resuelto_por: number | null;
  fecha_resolucion: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface IVacationListFilters {
  id_municipio?: number;
  id_tipo_personal_salud?: number;
  estado?: VacationStatus;
  id_usuario?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  page_size?: number;
}

export interface IVacationListResponse {
  items: IVacationRequest[];
  total: number;
  page: number;
  page_size: number;
}

export interface ICreateVacationPayload {
  id_municipio: number;
  id_tipo_personal_salud: number;
  fecha_inicio: string;
  fecha_fin: string;
  observacion_solicitante: string | null;
}

export interface IResolveVacationPayload {
  estado: VacationDecision;
  observacion_resolucion: string | null;
}

export interface IVacationOperationResponse {
  solicitud: IVacationRequest;
}

export interface IVacationOption {
  id: number;
  nombre: string;
}

export interface IVacationOptions {
  municipios: IVacationOption[];
  tipos_personal_salud: IVacationOption[];
  puede_resolver: boolean;
}

export interface IVacationCriticalDay {
  fecha: string;
  personal_ausente: number;
  porcentaje: number | null;
  nivel: VacationLevel;
}

export interface IVacationAlert {
  id_municipio: number;
  id_tipo_personal_salud: number;
  fecha_desde: string;
  fecha_hasta: string;
  escenario: VacationScenario;
  total_personal: number;
  maximo_personal_ausente: number;
  porcentaje_maximo: number | null;
  nivel_maximo: VacationLevel;
  fecha_maximo_riesgo: string;
  alerta: string;
  dias_criticos: IVacationCriticalDay[];
  solicitudes_involucradas: number[];
  nombre_municipio: string;
  nombre_tipo_personal_salud: string;
}

export interface IVacationAlertsFilters {
  id_municipio?: number;
  id_tipo_personal_salud?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  escenario?: VacationScenario;
  page?: number;
  page_size?: number;
}

export interface IVacationAlertsResponse {
  items: IVacationAlert[];
  total: number;
  page: number;
  page_size: number;
  fecha_desde: string;
  fecha_hasta: string;
  escenario: VacationScenario;
}
