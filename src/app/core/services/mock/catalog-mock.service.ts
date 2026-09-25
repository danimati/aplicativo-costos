import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CatalogService } from '../catalog.service';
import { CatalogMaterial, CatalogProvider } from '../../models/material.model';

const MOCK_MATERIALS: CatalogMaterial[] = [
  {
    code: 'MAT-001',
    description: 'Interruptor termomagnético 3P',
    supplier: 'Schneider Electric',
    family: 'Eléctrico',
    baseCost: 'MXN 1,240.00',
    status: 'ACTIVO',
  },
  {
    code: 'MAT-002',
    description: 'Gabinete metálico IP55',
    supplier: 'Rittal',
    family: 'Envolventes',
    baseCost: 'MXN 8,960.00',
    status: 'ACTIVO',
  },
  {
    code: 'MAT-003',
    description: 'Cable de control 18 AWG',
    supplier: 'Viakon',
    family: 'Conductores',
    baseCost: 'MXN 18.40 / m',
    status: 'ACTIVO',
  },
  {
    code: 'MAT-004',
    description: 'Canaleta ranurada 40×60',
    supplier: 'Phoenix Contact',
    family: 'Accesorios',
    baseCost: 'MXN 86.00 / m',
    status: 'REVISAR',
  },
];

const MOCK_PROVIDERS: CatalogProvider[] = [
  {
    code: 'PRV-001',
    supplier: 'Schneider Electric',
    specialty: 'Componentes eléctricos',
    location: 'Monterrey, NL',
    catalogCount: '12 SKUs',
    status: 'ACTIVO',
  },
  {
    code: 'PRV-002',
    supplier: 'Rittal',
    specialty: 'Gabinetes y envolventes',
    location: 'Querétaro, QRO',
    catalogCount: '8 SKUs',
    status: 'ACTIVO',
  },
  {
    code: 'PRV-003',
    supplier: 'Viakon',
    specialty: 'Conductores',
    location: 'Ciudad de México',
    catalogCount: '21 SKUs',
    status: 'ACTIVO',
  },
  {
    code: 'PRV-004',
    supplier: 'Phoenix Contact',
    specialty: 'Conectividad industrial',
    location: 'Tlalnepantla, EDO. MEX.',
    catalogCount: '6 SKUs',
    status: 'PENDIENTE',
  },
];

@Injectable()
export class CatalogMockService implements CatalogService {
  getMaterials(): Observable<CatalogMaterial[]> {
    return of(MOCK_MATERIALS).pipe(delay(150));
  }
  getProviders(): Observable<CatalogProvider[]> {
    return of(MOCK_PROVIDERS).pipe(delay(150));
  }
}
