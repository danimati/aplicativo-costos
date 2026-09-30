// src/app/core/services/mock/labor-mock.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LaborService } from '../labor.service';
import { LaborStage } from '../../models/labor.model';

const MOCK: Record<string, LaborStage[]> = {
  'PRY-2024-089': [
    {
      id: 'lb1',
      projectId: 'PRY-2024-089',
      name: 'Entendimiento del problema',
      estimatedHours: 8,
      hourlyRate: 45000,
      owner: 'A. Morales',
      status: 'COMPLETADO',
    },
    {
      id: 'lb2',
      projectId: 'PRY-2024-089',
      name: 'Diseño',
      estimatedHours: 24,
      hourlyRate: 55000,
      owner: 'A. Morales',
      status: 'COMPLETADO',
    },
    {
      id: 'lb3',
      projectId: 'PRY-2024-089',
      name: 'Fabricación',
      estimatedHours: 40,
      hourlyRate: 38000,
      owner: 'J. Castañeda',
      status: 'EN PROCESO',
    },
    {
      id: 'lb4',
      projectId: 'PRY-2024-089',
      name: 'Configuración',
      estimatedHours: 16,
      hourlyRate: 50000,
      owner: 'L. Medina',
      status: 'PENDIENTE',
    },
    {
      id: 'lb5',
      projectId: 'PRY-2024-089',
      name: 'Instalación',
      estimatedHours: 20,
      hourlyRate: 42000,
      owner: 'J. Castañeda',
      status: 'PENDIENTE',
    },
    {
      id: 'lb6',
      projectId: 'PRY-2024-089',
      name: 'Calibración',
      estimatedHours: 10,
      hourlyRate: 60000,
      owner: 'A. Morales',
      status: 'PENDIENTE',
      notes: 'Requiere certificado metrológico vigente.',
    },
  ],
  'PRY-2024-076': [
    {
      id: 'lb7',
      projectId: 'PRY-2024-076',
      name: 'Entendimiento del problema',
      estimatedHours: 6,
      hourlyRate: 45000,
      owner: 'J. Castañeda',
      status: 'COMPLETADO',
    },
    {
      id: 'lb8',
      projectId: 'PRY-2024-076',
      name: 'Diseño',
      estimatedHours: 18,
      hourlyRate: 55000,
      owner: 'J. Castañeda',
      status: 'COMPLETADO',
    },
    {
      id: 'lb9',
      projectId: 'PRY-2024-076',
      name: 'Fabricación',
      estimatedHours: 30,
      hourlyRate: 38000,
      owner: 'L. Medina',
      status: 'COMPLETADO',
    },
    {
      id: 'lb10',
      projectId: 'PRY-2024-076',
      name: 'Instalación',
      estimatedHours: 14,
      hourlyRate: 42000,
      owner: 'L. Medina',
      status: 'EN PROCESO',
    },
  ],
};

@Injectable()
export class LaborMockService implements LaborService {
  getByProject(projectId: string): Observable<LaborStage[]> {
    return of(MOCK[projectId] ?? []).pipe(delay(150));
  }
}
