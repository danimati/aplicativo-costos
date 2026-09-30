import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { InstallationService } from '../installation.service';
import { InstallationActivity } from '../../models/installation.model';
import { WiringCircuit } from '../../models/wiring.model';
import { ProgrammingEntry } from '../../models/programming.model';
import { TestCase } from '../../models/testing.model';

const INSTALACION: Record<string, InstallationActivity[]> = {
  'PRY-2024-089': [
    {
      id: 'in1',
      projectId: 'PRY-2024-089',
      activity: 'Anclaje de gabinete en sitio',
      location: 'Línea Extrusión 04 — Planta Norte',
      owner: 'J. Castañeda',
      status: 'PENDIENTE',
      progress: 0,
      targetDate: '2026-10-10',
      prerequisite: 'Fabricación y ensamble completos',
    },
    {
      id: 'in2',
      projectId: 'PRY-2024-089',
      activity: 'Conexión a tablero general',
      location: 'Línea Extrusión 04 — Planta Norte',
      owner: 'L. Medina',
      status: 'PENDIENTE',
      progress: 0,
      targetDate: '2026-10-12',
    },
    {
      id: 'in3',
      projectId: 'PRY-2024-089',
      activity: 'Verificación de puesta a tierra',
      location: 'Línea Extrusión 04 — Planta Norte',
      owner: 'L. Medina',
      status: 'PENDIENTE',
      progress: 0,
      targetDate: '2026-10-13',
      notes: 'Requiere certificado de resistencia de tierra vigente.',
    },
  ],
};

const CABLEADO: Record<string, WiringCircuit[]> = {
  'PRY-2024-089': [
    {
      id: 'ca1',
      projectId: 'PRY-2024-089',
      circuitRef: 'CTO-014',
      origin: 'PLC — salida digital 1',
      destination: 'Contactor principal',
      gauge: '12 AWG',
      quantity: 8,
      status: 'CONECTADO',
      qcPending: false,
    },
    {
      id: 'ca2',
      projectId: 'PRY-2024-089',
      circuitRef: 'CTO-015',
      origin: 'Variador 1',
      destination: 'Motor extrusión',
      gauge: '10 AWG',
      quantity: 12,
      status: 'EN REVISIÓN',
      qcPending: true,
    },
    {
      id: 'ca3',
      projectId: 'PRY-2024-089',
      circuitRef: 'CTO-016',
      origin: 'Fuente 24VDC',
      destination: 'Sensores de línea',
      gauge: '18 AWG',
      quantity: 20,
      status: 'PENDIENTE',
      qcPending: false,
    },
  ],
};

const PROGRAMACION: Record<string, ProgrammingEntry[]> = {
  'PRY-2024-089': [
    {
      id: 'pg1',
      projectId: 'PRY-2024-089',
      controller: 'PLC Siemens S7-1500',
      programVersion: 'v0.3-beta',
      owner: 'A. Morales',
      status: 'EN DESARROLLO',
      reviewDate: '2026-10-15',
      milestones: [
        { label: 'Lógica de arranque/paro', done: true },
        { label: 'Interbloqueos de seguridad', done: true },
        { label: 'Control de velocidad de extrusión', done: false },
        { label: 'Pantalla HMI de operación', done: false },
      ],
      blockers: 'Pendiente definición final de setpoints con el cliente.',
    },
  ],
};

const PRUEBAS: Record<string, TestCase[]> = {
  'PRY-2024-089': [
    {
      id: 'ts1',
      projectId: 'PRY-2024-089',
      protocol: 'Prueba de aislamiento eléctrico',
      owner: 'L. Medina',
      result: 'PENDIENTE',
      date: '2026-10-18',
    },
    {
      id: 'ts2',
      projectId: 'PRY-2024-089',
      protocol: 'Prueba de continuidad de tierra',
      owner: 'L. Medina',
      result: 'PENDIENTE',
      date: '2026-10-18',
    },
    {
      id: 'ts3',
      projectId: 'PRY-2024-089',
      protocol: 'Prueba funcional de arranque/paro',
      owner: 'A. Morales',
      result: 'PENDIENTE',
      date: '2026-10-20',
    },
  ],
};

@Injectable()
export class InstallationMockService implements InstallationService {
  getInstalacion(projectId: string): Observable<InstallationActivity[]> {
    return of(INSTALACION[projectId] ?? []).pipe(delay(150));
  }

  getCableado(projectId: string): Observable<WiringCircuit[]> {
    return of(CABLEADO[projectId] ?? []).pipe(delay(150));
  }

  getProgramacion(projectId: string): Observable<ProgrammingEntry[]> {
    return of(PROGRAMACION[projectId] ?? []).pipe(delay(150));
  }

  getPruebas(projectId: string): Observable<TestCase[]> {
    return of(PRUEBAS[projectId] ?? []).pipe(delay(150));
  }
}
