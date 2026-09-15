import {
  AppointmentCategory,
  AppointmentOrigin,
  AppointmentStatusFilter,
  PatientSex,
} from "../interfaces/appointments";

export const APPOINTMENT_CATEGORIES: readonly AppointmentCategory[] = [
  "GENERAL",
  "GESTANTE",
  "CRONICO",
] as const;

export const PATIENT_SEXES: readonly PatientSex[] = [
  "FEMENINO",
  "MASCULINO",
] as const;

export const APPOINTMENT_DURATION_BY_CATEGORY: Record<
  AppointmentCategory,
  number
> = {
  GENERAL: 15,
  GESTANTE: 45,
  CRONICO: 30,
};

export const getAppointmentDurationMin = (
  category: AppointmentCategory,
): number => APPOINTMENT_DURATION_BY_CATEGORY[category];

export const getAppointmentCategoriesForSex = (
  sex: PatientSex | "",
): AppointmentCategory[] => {
  if (sex === "FEMENINO") return [...APPOINTMENT_CATEGORIES];
  return APPOINTMENT_CATEGORIES.filter((category) => category !== "GESTANTE");
};

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
