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
  startDate: string; // ISO 'YYYY-MM-DD'
  endDate: string; // ISO 'YYYY-MM-DD'
  stages?: ProjectStage[];
  navTemplate?: NavCycle[]; // los ciclos
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  kind: 'markdown' | 'file';
  content: string; // Markdown, solo cuando kind === 'markdown'
  fileName?: string; // solo cuando kind === 'file'
  fileUrl?: string; // solo cuando kind === 'file'
  mimeType?: string; // solo cuando kind === 'file'
  updatedAt: string; // ISO
}

export interface CalendarEvent {
  day: string;
  title: string;
  project: string;
}
