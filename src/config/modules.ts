import { Clock, BarChart3, Users, Settings, Shield } from 'lucide-react';
import { Module } from '../types/types';
import AppointmentList from '../components/AppointmentList/AppointmentList';

export const MODULES: Module[] = [
  {
    id: 'turnos',
    name: 'Turnos',
    icon: Clock,
    allowedRoles: ['Médico', 'Supervisor'],
    component: AppointmentList,
    path: '/dashboard/turnos',
  },
  {
    id: 'reportes',
    name: 'Reportes',
    icon: BarChart3,
    allowedRoles: ['Admin', 'Supervisor', 'Medico'],
    component: AppointmentList,
    path: '/dashboard/reportes',
  },
  {
    id: 'usuarios',
    name: 'Usuarios',
    icon: Users,
    allowedRoles: ['Admin'],
    component: AppointmentList,
    path: '/dashboard/usuarios',
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    icon: Settings,
    allowedRoles: ['Admin', 'Supervisor', 'Médico'],
    component: AppointmentList,
    path: '/dashboard/configuracion',
  },
  {
    id: 'permisos',
    name: 'Permisos',
    icon: Shield,
    allowedRoles: ['Admin', 'Supervisor', 'Médico'],
    component: AppointmentList,
    path: '/dashboard/permisos',
  },
];
