import { CalendarDays, Edit3, FileBarChart, FilePlus } from "lucide-react";
import { Module } from "../types/types";
import ScheduleViewer from "../components/ScheduleViewer/ScheduleViewer";
import ScheduleManagement from "../components/ScheduleManagement/ScheduleManagement";
import Reports from "../components/Reports/Reports";
import UnsatisfiedDemand from "../components/Unsatisfied-demand/UnsatisfiedDemand";

export const MODULES: Module[] = [
  {
    id: 1,
    name: "Visualización Turnos",
    icon: CalendarDays,
    allowedRoles: [1],
    component: ScheduleViewer,
    path: "/dashboard/vizualizacion-turnos",
    bgColor: "#DBEAFE",
    hoverColor: "#2563EB",
  },
  {
    id: 2,
    name: "Editar Turnos y Novedades",
    icon: Edit3,
    allowedRoles: [1],
    component: ScheduleManagement,
    path: "/dashboard/gestion-turnos",
    bgColor: "#FDE68A",
    hoverColor: "#F59E0B",
  },
  {
    id: 3,
    name: "Generar Reporte",
    icon: FileBarChart,
    allowedRoles: [1],
    component: Reports,
    path: "/dashboard/reportes",
    bgColor: "#D1FAE5",
    hoverColor: "#10B981",
  },
  {
    id: 4,
    name: "Registrar Demanda Insatisfecha",
    icon: FilePlus,
    allowedRoles: [4],
    component: UnsatisfiedDemand,
    path: "/dashboard/demanda-insatisfecha",
    bgColor: "#FCE7F3",
    hoverColor: "#DB2777",
  },
];
