export type InstallationStatus = 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO' | 'BLOQUEADO';

export interface InstallationActivity {
  id: string;
  projectId: string;
  activity: string;
  location: string; // frente de trabajo, ej: 'Línea Extrusión 04 — Planta Norte'
  owner: string;
  status: InstallationStatus;
  progress: number;
  targetDate: string; // ISO
  prerequisite?: string; // requisito previo, si aplica
  notes?: string;
}
