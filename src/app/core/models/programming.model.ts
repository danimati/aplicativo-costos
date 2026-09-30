export type ProgrammingStatus = 'PENDIENTE' | 'EN DESARROLLO' | 'EN REVISIÓN' | 'APROBADO';

export interface ProgrammingMilestone {
  label: string;
  done: boolean;
}

export interface ProgrammingEntry {
  id: string;
  projectId: string;
  controller: string; // ej: 'PLC Siemens S7-1500'
  programVersion: string;
  owner: string;
  status: ProgrammingStatus;
  reviewDate: string; // ISO
  milestones: ProgrammingMilestone[];
  blockers?: string;
}
