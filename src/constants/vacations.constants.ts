import {
  VacationLevel,
  VacationScenario,
  VacationStatus,
} from "../interfaces/vacations";

export const VACATION_STATUSES: VacationStatus[] = [
  "PENDIENTE",
  "APROBADA",
  "RECHAZADA",
];

export const VACATION_SCENARIOS: VacationScenario[] = [
  "proyeccion",
  "solo_aprobadas",
];

export const VACATION_LEVELS: VacationLevel[] = [
  "SIN_PERSONAL",
  "SIN_ALERTA",
  "ADVERTENCIA",
  "ALTO",
];

export const DEFAULT_VACATIONS_PAGE_SIZE = 20;

export const VACATION_ALERTS_PAGE_SIZE = 100;

export const VACATIONS_PAGE_SIZE_OPTIONS = [10, 20, 50];

export const MAX_VACATION_DAYS = 366;

export const MAX_VACATION_OBSERVATION_LENGTH = 10000;

export const VACATION_USERS_SEARCH_PER_PAGE = 100;
