import { Module } from "../types/types";

export const filterModulesByRole = (
  modules: Module[],
  userRoleId: number,
): Module[] => {
  return modules.filter((module) => module.allowedRoles.includes(userRoleId));
};

export const hasPermission = (module: Module, userRoleId: number): boolean => {
  return module.allowedRoles.includes(userRoleId);
};

export const getModuleByPath = (
  modules: Module[],
  fullPath: string,
): Module | undefined =>
  modules.find((m) => m.path === fullPath || fullPath.startsWith(m.path + "/"));
