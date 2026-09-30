import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProductionService } from '../production.service';
import { ProductionActivity, AssemblyUnit } from '../../models/production.model';

const FABRICACION: Record<string, ProductionActivity[]> = {
  'PRY-2024-089': [
    {
      id: 'fb1',
      projectId: 'PRY-2024-089',
      stage: 'Corte y perforado de gabinete',
      description: 'Preparación mecánica del gabinete IP55',
      owner: 'J. Castañeda',
      status: 'COMPLETADO',
      progress: 100,
      targetDate: '2026-09-05',
    },
    {
      id: 'fb2',
      projectId: 'PRY-2024-089',
      stage: 'Montaje de riel DIN',
      description: 'Instalación de riel y canaletas internas',
      owner: 'J. Castañeda',
      status: 'COMPLETADO',
      progress: 100,
      targetDate: '2026-09-10',
    },
    {
      id: 'fb3',
      projectId: 'PRY-2024-089',
      stage: 'Cableado de potencia',
      description: 'Tendido de cable de potencia entre PLC y variadores',
      owner: 'L. Medina',
      status: 'EN PROCESO',
      progress: 55,
      targetDate: '2026-09-28',
    },
    {
      id: 'fb4',
      projectId: 'PRY-2024-089',
      stage: 'Rotulado de bornes',
      description: 'Identificación de bornes según plano eléctrico',
      owner: 'L. Medina',
      status: 'PENDIENTE',
      progress: 0,
      targetDate: '2026-10-03',
    },
  ],
};

const ENSAMBLE: Record<string, AssemblyUnit[]> = {
  'PRY-2024-089': [
    {
      id: 'as1',
      projectId: 'PRY-2024-089',
      name: 'Conjunto de control (PLC + E/S)',
      status: 'COMPLETADO',
      owner: 'J. Castañeda',
      progress: 100,
      dependsOn: [],
    },
    {
      id: 'as2',
      projectId: 'PRY-2024-089',
      name: 'Conjunto de potencia (variadores + contactores)',
      status: 'EN PROCESO',
      owner: 'L. Medina',
      progress: 60,
      dependsOn: ['as1'],
    },
    {
      id: 'as3',
      projectId: 'PRY-2024-089',
      name: 'Conjunto de campo (bornes de salida)',
      status: 'BLOQUEADO',
      owner: 'L. Medina',
      progress: 0,
      dependsOn: ['as2'],
    },
  ],
};

@Injectable()
export class ProductionMockService implements ProductionService {
  getFabricacion(projectId: string): Observable<ProductionActivity[]> {
    return of(FABRICACION[projectId] ?? []).pipe(delay(150));
  }

  getEnsamble(projectId: string): Observable<AssemblyUnit[]> {
    return of(ENSAMBLE[projectId] ?? []).pipe(delay(150));
  }
}
