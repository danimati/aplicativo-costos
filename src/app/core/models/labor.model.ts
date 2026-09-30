export type LaborStageStatus = 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO';

export interface LaborStage {
  id: string;
  projectId: string;
  name: string; // 'Entendimiento del problema', 'Diseño', 'Fabricación', 'Configuración', 'Instalación', 'Calibración'
  estimatedHours: number;
  hourlyRate: number;
  owner: string;
  status: LaborStageStatus;
  notes?: string;
}
