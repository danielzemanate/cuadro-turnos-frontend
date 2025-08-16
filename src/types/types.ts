import { LucideIcon } from "lucide-react";
import { FC } from "react";

export interface User {
  id: number;
  nombre: string;
  rol: string;
}

export interface Module {
  id: number;
  name: string;
  icon: LucideIcon;
  allowedRoles: string[];
  component: FC;
  path: string;
  bgColor: string;
  hoverColor: string;
}

export type AppointmentStatus =
  | "PENDING"
  | "ATTENDED"
  | "NO_SHOW"
  | "CANCELLED";
