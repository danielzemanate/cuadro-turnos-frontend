export type AppointmentCategory = "GENERAL" | "GESTANTE" | "CRONICO";
export type AppointmentStatusFilter =
  | "PENDIENTE"
  | "CONFIRMADA"
  | "CANCELADA"
  | "ATENDIDA";
export type AppointmentOrigin = "WEB" | "WHATSAPP";

export interface IAppointment {
  id: number;
  codigo_confirmacion: string;
  id_paciente: number;
  paciente: string;
  categoria_paciente: string;
  id_personal_salud: number;
  nombre_medico: string;
  id_municipio: number;
  municipio: string;
  id_tipo_atencion: number;
  tipo_atencion: string;
  id_sede: number;
  sede: string;
  id_cuadro_dia: number;
  id_intervalo: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  duracion_minutos: number;
  direccion_atencion: string;
  telefono_contacto: string;
  estado: string;
  origen: string;
  observaciones: string;
  fecha_creacion: string;
}

export interface IAppointmentsListResponse {
  status: string;
  total: number;
  page: number;
  per_page: number;
  items: IAppointment[];
}

export interface IAppointmentsFilters {
  id_municipio: number;
  nombre_medico?: string;
  id_personal_salud?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  categoria_paciente?: AppointmentCategory | "";
  estado?: AppointmentStatusFilter | "";
  origen?: AppointmentOrigin | "";
  codigo_confirmacion?: string;
  page?: number;
  per_page?: number;
}

export interface ICreateAppointmentPayload {
  tipo_documento: string;
  numero_documento: string;
  nombre_completo: string;
  telefono_contacto: string;
  categoria_paciente: AppointmentCategory;
  id_personal_salud: number;
  id_municipio: number;
  id_sede: number;
  fecha: string;
  hora_inicio: string;
  duracion_min: number;
  origen: AppointmentOrigin;
  observaciones: string;
}

export interface ICancelAppointmentPayload {
  motivo: string;
  actor_tipo: AppointmentOrigin;
}

export interface IRescheduleAppointmentPayload {
  id_personal_salud: number;
  fecha: string;
  hora_inicio: string;
  motivo: string;
  actor_tipo: AppointmentOrigin;
}
