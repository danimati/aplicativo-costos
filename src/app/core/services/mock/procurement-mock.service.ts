import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProcurementService } from '../procurement.service';
import { ProcurementItem } from '../../models/procurement.model';

const MOCK: Record<string, ProcurementItem[]> = {
  'PRY-2024-089': [
    {
      id: 'pc1',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-001',
      materialDescription: 'PLC Siemens S7-1500',
      supplier: 'Siemens Colombia',
      quotationRef: 'COT-4471',
      unitPrice: 8500000,
      discountPercent: 5,
      quantity: 1,
      receivedQuantity: 1,
      status: 'COMPLETO',
      expectedDate: '2026-08-01',
      owner: 'A. Morales',
    },
    {
      id: 'pc2',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-014',
      materialDescription: 'Variador de frecuencia 15HP',
      supplier: 'Danfoss',
      quotationRef: 'COT-4488',
      unitPrice: 3200000,
      discountPercent: 0,
      quantity: 2,
      receivedQuantity: 1,
      status: 'PARCIAL',
      expectedDate: '2026-09-10',
      owner: 'J. Castañeda',
    },
    {
      id: 'pc3',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-022',
      materialDescription: 'Contactor 3 polos 40A',
      supplier: 'Schneider Electric',
      quotationRef: 'COT-4502',
      unitPrice: 145000,
      discountPercent: 8,
      quantity: 6,
      receivedQuantity: 0,
      status: 'ORDENADO',
      expectedDate: '2026-09-25',
      owner: 'J. Castañeda',
    },
    {
      id: 'pc4',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-031',
      materialDescription: 'Gabinete IP55 800x600',
      supplier: 'Rittal',
      quotationRef: 'COT-4519',
      unitPrice: 1850000,
      discountPercent: 0,
      quantity: 1,
      receivedQuantity: 0,
      status: 'SOLICITADO',
      expectedDate: '2026-10-02',
      owner: 'A. Morales',
    },
    {
      id: 'pc5',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-045',
      materialDescription: 'Cable THHN 12 AWG (rollo)',
      supplier: 'Centelsa',
      quotationRef: '',
      unitPrice: 210000,
      discountPercent: 0,
      quantity: 4,
      receivedQuantity: 0,
      status: 'PENDIENTE',
      expectedDate: '2026-10-05',
      owner: 'L. Medina',
    },
  ],
};

@Injectable()
export class ProcurementMockService implements ProcurementService {
  getByProject(projectId: string): Observable<ProcurementItem[]> {
    return of(MOCK[projectId] ?? []).pipe(delay(150));
  }
}
