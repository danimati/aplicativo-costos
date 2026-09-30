export type ProcurementStatus = 'PENDIENTE' | 'SOLICITADO' | 'ORDENADO' | 'PARCIAL' | 'COMPLETO';

export interface ProcurementItem {
  id: string;
  projectId: string;
  materialId: string;
  materialDescription: string;
  supplier: string;
  quotationRef: string;
  unitPrice: number;
  discountPercent: number; // 0-100
  quantity: number;
  receivedQuantity: number; // para calcular valor recibido vs solicitado
  status: ProcurementStatus;
  expectedDate: string; // ISO
  owner: string;
}
