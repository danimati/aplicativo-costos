import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  CalendarEvent,
  Project,
  ProjectStage,
} from '../../models/project.model';
import { ProjectService } from '../project.service';
import { INDUSTRIAL_NAV_TEMPLATE } from '../../../data/data.nav';


const MOCK_STAGES: ProjectStage[] = [
  {
    id: '01',
    name: 'Ingeniería & Estimación',
    status: 'COMPLETADO',
    progress: 100,
    owner: 'AM',
    dueDate: '12 AGO 2026',
  },
  {
    id: '02',
    name: 'Adquisición & Taller',
    status: 'EN PROCESO',
    progress: 65,
    owner: 'JC',
    dueDate: '25 SEP 2026',
  },
  {
    id: '03',
    name: 'Liquidación & Calibración',
    status: 'PENDIENTE',
    progress: 0,
    owner: 'AM',
    dueDate: '10 OCT 2026',
  },
];


// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRY-2024-089',
    name: 'Tablero Línea Extrusión 04',
    status: 'EN EJECUCIÓN',
    cutDate: '22 SEP 2026',
    progress: '68%',
    family: 'CONTROL EXTRUSIÓN',
    owner: 'AM',

    stages: MOCK_STAGES,

    // Navegación específica de este proyecto
    navTemplate: INDUSTRIAL_NAV_TEMPLATE,
  },

  {
    id: 'PRY-2024-076',
    name: 'Celda de ensamble neumático',
    status: 'EN CIERRE',
    cutDate: '14 SEP 2026',
    progress: '92%',
    family: 'AUTOMATIZACIÓN',
    owner: 'JC',

    // Este proyecto utiliza la misma plantilla
    // de navegación industrial.
    navTemplate: INDUSTRIAL_NAV_TEMPLATE,
  },

  {
    id: 'PRY-2024-061',
    name: 'Retrofit transportador norte',
    status: 'PAUSADO',
    cutDate: '29 AGO 2026',
    progress: '41%',
    family: 'TRANSPORTE',
    owner: 'LM',

    navTemplate: INDUSTRIAL_NAV_TEMPLATE,
  },

  {
    id: 'PRY-2024-044',
    name: 'Tablero de fuerza Planta B',
    status: 'FINALIZADO',
    cutDate: '18 JUL 2026',
    progress: '100%',
    family: 'ENERGÍA',
    owner: 'AM',

    navTemplate: INDUSTRIAL_NAV_TEMPLATE,
  },
];


// ─────────────────────────────────────────────
// CALENDAR
// ─────────────────────────────────────────────

const MOCK_CALENDAR: CalendarEvent[] = [
  {
    day: '22',
    title: 'CORTE DE COSTOS',
    project: 'PRY-2024-089',
  },
  {
    day: '24',
    title: 'REVISIÓN DE BOM',
    project: 'PRY-2024-089',
  },
  {
    day: '28',
    title: 'ENTREGA DE TABLERO',
    project: 'PRY-2024-076',
  },
  {
    day: '02',
    title: 'CIERRE DE PROYECTO',
    project: 'PRY-2024-061',
  },
  {
    day: '07',
    title: 'AUDITORÍA INTERNA',
    project: 'TODOS LOS PROYECTOS',
  },
];


// ─────────────────────────────────────────────
// MOCK SERVICE
// ─────────────────────────────────────────────

@Injectable()
export class ProjectMockService implements ProjectService {

  getProjects(): Observable<Project[]> {
    return of(MOCK_PROJECTS).pipe(
      delay(150)
    );
  }

  getProjectById(
    id: string
  ): Observable<Project | undefined> {
    return of(
      MOCK_PROJECTS.find(project => project.id === id)
    ).pipe(
      delay(150)
    );
  }

  getCalendarEvents(): Observable<CalendarEvent[]> {
    return of(MOCK_CALENDAR).pipe(
      delay(150)
    );
  }
}
