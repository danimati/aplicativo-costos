export type ReceptionStatus = 'PENDIENTE' | 'CONFORME' | 'INCIDENCIA' | 'RECHAZADO';

export interface ReceptionItem {
  id: string;
  projectId: string;
  materialId: string;
  materialDescription: string;
  supplier: string;
  lotRef: string;
  requestedQuantity: number;
  receivedQuantity: number;
  receivedDate: string | null; // ISO, null si aún no llega
  status: ReceptionStatus;
  incidentNote?: string;
  owner: string;
}
