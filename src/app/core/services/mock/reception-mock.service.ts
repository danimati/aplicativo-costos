import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ReceptionService } from '../reception.service';
import { ReceptionItem } from '../../models/reception.model';

const MOCK: Record<string, ReceptionItem[]> = {
  'PRY-2024-089': [
    {
      id: 'rc1',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-001',
      materialDescription: 'PLC Siemens S7-1500',
      supplier: 'Siemens Colombia',
      lotRef: 'LOTE-2208',
      requestedQuantity: 1,
      receivedQuantity: 1,
      receivedDate: '2026-08-03',
      status: 'CONFORME',
      owner: 'L. Medina',
    },
    {
      id: 'rc2',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-014',
      materialDescription: 'Variador de frecuencia 15HP',
      supplier: 'Danfoss',
      lotRef: 'LOTE-2231',
      requestedQuantity: 2,
      receivedQuantity: 1,
      receivedDate: '2026-09-12',
      status: 'INCIDENCIA',
      incidentNote:
        'Llegó 1 de 2 unidades; proveedor confirma envío pendiente para la próxima semana.',
      owner: 'L. Medina',
    },
    {
      id: 'rc3',
      projectId: 'PRY-2024-089',
      materialId: 'MAT-022',
      materialDescription: 'Contactor 3 polos 40A',
      supplier: 'Schneider Electric',
      lotRef: '—',
      requestedQuantity: 6,
      receivedQuantity: 0,
      receivedDate: null,
      status: 'PENDIENTE',
      owner: 'L. Medina',
    },
  ],
};

@Injectable()
export class ReceptionMockService implements ReceptionService {
  getByProject(projectId: string): Observable<ReceptionItem[]> {
    return of(MOCK[projectId] ?? []).pipe(delay(150));
  }
}
