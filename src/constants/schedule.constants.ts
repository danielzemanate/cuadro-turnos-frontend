export const RolesDatabase = {
  COORDINADOR: 1,
  PERSONAL_SALUD: 2,
  DILIGENCIADOR: 3,
  COORDINADOR_SIAU: 4,
  SIAU: 5,
  ADMINISTRADOR: 6,
  GERENCIA: 7,
  SUBGERENCIA_ADMINISTRATIVA: 8,
  SEGURIDAD_PACIENTE: 9,
  LIDER_PROYECTOS: 10,
  INGENIERO: 11,
  TALENTO_HUMANO: 12,
  COSTOS: 13,
} as const;

export const Roles = {
  COORDINADOR: 1,
  PERSONAL_SALUD: 2,
} as const;

export type RoleId = (typeof Roles)[keyof typeof Roles];

// IDs de tipos_personal_salud del backend (seed). SIAU solo aplica a Médico.
export const PersonalTypesDatabase = {
  MEDICO: 1,
  ODONTOLOGO: 2,
  BACTERIOLOGO: 3,
  JEFE_ENFERMERIA: 4,
  AUXILIAR_ENFERMERIA: 5,
  PSICOLOGIA: 6,
  FONOAUDIOLOGIA: 7,
  FISIOTERAPIA: 8,
} as const;

/** Siglas de consulta externa que requieren intervalo horario al editar turno de médico. */
export const INTERVAL_REQUIRED_SIGLAS = ["CE", "CEC", "CED"] as const;

export type IntervalRequiredSigla = (typeof INTERVAL_REQUIRED_SIGLAS)[number];

/** Horas exactas por sigla (ni más ni menos). */
export const INTERVAL_REQUIRED_HOURS: Record<IntervalRequiredSigla, number> = {
  CE: 8,
  CED: 8,
  CEC: 16,
};

export const MIN_SCHEDULE_INTERVAL_HOURS = 8;

export const requiresScheduleInterval = (sigla: string): boolean =>
  (INTERVAL_REQUIRED_SIGLAS as readonly string[]).includes(sigla);
