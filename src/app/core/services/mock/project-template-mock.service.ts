import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProjectTemplateService } from '../project-template.service';
import { ProjectTemplateSnapshot } from '../../models/project-template.model';

const MOCK: Record<string, ProjectTemplateSnapshot> = {
  'PRY-2024-089': {
    projectId: 'PRY-2024-089',
    templateName: 'Tablero de Control — Extrusión Estándar',
    version: 'v4.2',
    family: 'CONTROL EXTRUSIÓN',
    author: 'A. Morales',
    appliedAt: '2026-07-15T09:00:00.000Z',
    status: 'VIGENTE',
    blocks: [
      { label: 'Materiales', source: 'Plantilla Extrusión Estándar v4.2', overridden: true },
      { label: 'Mano de obra', source: 'Plantilla Extrusión Estándar v4.2', overridden: false },
      {
        label: 'Parámetros eléctricos',
        source: 'Plantilla Extrusión Estándar v4.2',
        overridden: false,
      },
    ],
  },
};

@Injectable()
export class ProjectTemplateMockService implements ProjectTemplateService {
  getByProject(projectId: string): Observable<ProjectTemplateSnapshot | null> {
    return of(MOCK[projectId] ?? null).pipe(delay(150));
  }
}
