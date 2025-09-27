export const RolesDatabase = {
  COORDINADOR: 1,
  PERSONAL_SALUD: 2,
  DILIGENCIADOR: 3,
  COORDINADOR_SIAU: 4,
  SIAU: 5,
  ADMINISTRADOR: 6,
} as const;

export const Roles = {
  COORDINADOR: 1,
  PERSONAL_SALUD: 2,
} as const;

export type RoleId = (typeof Roles)[keyof typeof Roles];
