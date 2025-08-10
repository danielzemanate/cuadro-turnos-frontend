import { Module } from '../types/types';

export const filterModulesByRole = (modules: Module[], userRole: string): Module[] => {
  return modules.filter((module) => module.allowedRoles.includes(userRole));
};

export const hasPermission = (module: Module, userRole: string): boolean => {
  return module.allowedRoles.includes(userRole);
};
