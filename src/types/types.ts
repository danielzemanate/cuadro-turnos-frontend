import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

export interface User {
  id: number;
  nombre: string;
  rol: string;
}

export interface Module {
  id: string;
  name: string;
  icon: LucideIcon;
  allowedRoles: string[];
  component: FC;
  path: string;
}
