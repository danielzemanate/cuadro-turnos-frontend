import {
  CalendarDays,
  Edit3,
  FileBarChart,
  FilePlus,
  Settings,
  Shield,
} from "lucide-react";
import { Module } from "../types/types";
import ScheduleViewer from "../components/ScheduleViewer/ScheduleViewer";
import Reports from "../components/Reports/Reports";
import UnsatisfiedDemand from "../components/Unsatisfied-demand/UnsatisfiedDemand";
import React, { ComponentType } from "react";
import UsersConfig from "../components/UsersConfig/UsersConfig";
import Administration from "../components/Administration/Administration";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ScheduleViewerEditable: ComponentType<any> = (props) =>
  React.createElement(ScheduleViewer, { ...props, editable: true });

export const MODULES: Module[] = [
  {
    id: 1,
    name: "Visualización Turnos",
    icon: CalendarDays,
    allowedRoles: [1, 2, 3, 4, 5, 6, 7, 10, 11, 12],
    component: ScheduleViewer,
    path: "/dashboard/vizualizacion-turnos",
    bgColor: "#DBEAFE",
    hoverColor: "#2563EB",
  },
  {
    id: 2,
    name: "Editar Turnos y Novedades",
    icon: Edit3,
    allowedRoles: [1, 6, 11],
    component: ScheduleViewerEditable,
    path: "/dashboard/gestion-turnos",
    bgColor: "#FDE68A",
    hoverColor: "#F59E0B",
  },
  {
    id: 3,
    name: "Generar Reporte",
    icon: FileBarChart,
    allowedRoles: [1, 6, 7, 10, 11, 13],
    component: Reports,
    path: "/dashboard/reportes",
    bgColor: "#D1FAE5",
    hoverColor: "#10B981",
  },
  {
    id: 4,
    name: "Registrar Demanda Insatisfecha",
    icon: FilePlus,
    allowedRoles: [],
    component: UnsatisfiedDemand,
    path: "/dashboard/demanda-insatisfecha",
    bgColor: "#FCE7F3",
    hoverColor: "#DB2777",
  },
  {
    id: 5,
    name: "Configuración de Usuarios",
    icon: Settings,
    allowedRoles: [6, 11],
    component: UsersConfig,
    path: "/dashboard/configuracion-usuarios",
    bgColor: "#F3E8FF",
    hoverColor: "#7C3AED",
  },
  {
    id: 6,
    name: "Administración",
    icon: Shield,
    allowedRoles: [6, 11, 13],
    component: Administration,
    path: "/dashboard/administracion",
    bgColor: "#DBEAFE",
    hoverColor: "#1E40AF",
  },
];
