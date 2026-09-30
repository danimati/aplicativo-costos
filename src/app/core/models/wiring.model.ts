export type WiringStatus = 'PENDIENTE' | 'CONECTADO' | 'EN REVISIÓN' | 'APROBADO';

export interface WiringCircuit {
  id: string;
  projectId: string;
  circuitRef: string; // ej: 'CTO-014'
  origin: string;
  destination: string;
  gauge: string; // calibre, ej: '12 AWG'
  quantity: number; // metros o cantidad de conductores
  status: WiringStatus;
  qcPending: boolean; // pendiente de control de calidad
}
