import {
  AppointmentCategory,
  AppointmentOrigin,
  AppointmentStatusFilter,
} from "../interfaces/appointments";

export const APPOINTMENT_CATEGORIES: readonly AppointmentCategory[] = [
  "GENERAL",
  "GESTANTE",
  "CRONICO",
] as const;

export const APPOINTMENT_STATUSES: readonly AppointmentStatusFilter[] = [
  "PENDIENTE",
  "CONFIRMADA",
  "CANCELADA",
  "ATENDIDA",
] as const;

export const APPOINTMENT_ORIGINS: readonly AppointmentOrigin[] = [
  "WEB",
  "WHATSAPP",
] as const;

export const DOCUMENT_TYPES = ["CC", "TI", "CE", "PA", "RC"] as const;

export const DEFAULT_APPOINTMENTS_PER_PAGE = 10;

/** Página grande para llenar selects de médicos sin paginar en UI */
export const DOCTORS_SEARCH_PER_PAGE = 100;
