export type ProductionStatus = 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO' | 'BLOQUEADO';

export interface ProductionActivity {
  id: string;
  projectId: string;
  stage: string;
  description: string;
  owner: string;
  status: ProductionStatus;
  progress: number; // 0-100, avance visual, no medición de tiempo real
  targetDate: string; // ISO
}

export interface AssemblyUnit {
  id: string;
  projectId: string;
  name: string;
  status: ProductionStatus;
  owner: string;
  progress: number;
  dependsOn: string[]; // ids de otros AssemblyUnit que deben completarse antes
}
