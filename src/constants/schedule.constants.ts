export const Roles = {
  COORDINADOR: 1,
  PERSONAL_SALUD: 2,
} as const;

export type RoleId = (typeof Roles)[keyof typeof Roles];
