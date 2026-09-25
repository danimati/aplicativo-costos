import { NavCycle } from './nav.model';

export interface ProjectStage {
  id: string;
  name: string;
  status: string; // ej: 'COMPLETADO', 'EN PROCESO', 'PENDIENTE'
  progress: number; // 0 a 100
  owner: string;
  dueDate: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  cutDate: string;
  progress: string;
  family: string;
  owner: string;
  stages?: ProjectStage[];
  navTemplate?: NavCycle[]; // los ciclos
}

export interface CalendarEvent {
  day: string;
  title: string;
  project: string;
}
