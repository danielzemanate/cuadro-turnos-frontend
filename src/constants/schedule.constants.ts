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
