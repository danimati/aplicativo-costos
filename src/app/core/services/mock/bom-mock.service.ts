import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BomService } from '../bom.service';
import { BomMaterial } from '../../models/material.model';

const MOCK_BOM: BomMaterial[] = [
  {
    id: '01',
    description: 'Interruptor termomagnético 3P',
    supplier: 'Schneider Electric',
    calcType: 'EXACTO',
    quantity: '2',
    unitPrice: '$ 1,240.00',
    subtotal: '$ 2,480.00',
    note: 'NSX 160F / 25kA',
  },
  {
    id: '02',
    description: 'Gabinete metálico IP55',
    supplier: 'Rittal',
    calcType: 'EXACTO',
    quantity: '1',
    unitPrice: '$ 8,960.00',
    subtotal: '$ 8,960.00',
    note: 'TS8 / 800×600×300 mm',
  },
  {
    id: '03',
    description: 'PLC compacto + módulos I/O',
    supplier: 'Siemens',
    calcType: 'EXACTO',
    quantity: '1',
    unitPrice: '$ 6,780.00',
    subtotal: '$ 6,780.00',
    note: 'S7-1200 / 24 DI/DO',
  },
  {
    id: '04',
    description: 'Cable de control 18 AWG',
    supplier: 'Viakon',
    calcType: 'ESTIMADO',
    quantity: '180 m',
    unitPrice: '$ 18.40',
    subtotal: '$ 3,312.00',
    note: '180m según perímetro y distribución TS8.',
  },
  {
    id: '05',
    description: 'Canaleta ranurada 40×60',
    supplier: 'Phoenix Contact',
    calcType: 'ESTIMADO',
    quantity: '12 m',
    unitPrice: '$ 86.00',
    subtotal: '$ 1,032.00',
    note: '12m según perímetro de gabinete.',
  },
];

@Injectable()
export class BomMockService implements BomService {
  getMaterials(_projectId: string): Observable<BomMaterial[]> {
    return of(MOCK_BOM).pipe(delay(150));
  }
}
