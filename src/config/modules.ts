import { CalendarDays, Edit3, FileBarChart } from "lucide-react";
import { Module } from "../types/types";
import ScheduleViewer from "../components/ScheduleViewer/ScheduleViewer";
import ScheduleManagement from "../components/ScheduleManagement/ScheduleManagement";
import Reports from "../components/Reports/Reports";

export const MODULES: Module[] = [
  {
    id: 1,
    name: "Visualización Turnos",
    icon: CalendarDays,
    allowedRoles: ["Coordinador"],
    component: ScheduleViewer,
    path: "/dashboard/vizualizacion-turnos",
    bgColor: "#DBEAFE", // azul claro
    hoverColor: "#2563EB", // azul fuerte
  },
  {
    id: 2,
    name: "Editar Turnos y Novedades",
    icon: Edit3,
    allowedRoles: ["Coordinador"],
    component: ScheduleManagement,
    path: "/dashboard/gestion-turnos",
    bgColor: "#FDE68A", // amarillo claro
    hoverColor: "#F59E0B", // ámbar
  },
  {
    id: 3,
    name: "Generar Reporte",
    icon: FileBarChart,
    allowedRoles: ["Coordinador"],
    component: Reports,
    path: "/dashboard/reportes",
    bgColor: "#D1FAE5", // verde menta
    hoverColor: "#10B981", // verde fuerte
  },
];
