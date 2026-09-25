import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProjectDocument } from '../../models/project.model';
import { ProjectDocumentService } from '../project-document.service';

const MOCK_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'd1', projectId: 'PRY-2024-089', title: 'Especificación técnica — Tablero Extrusión 04',
    kind: 'markdown',
    content:
      '# Alcance\nEste documento describe el diseño del tablero de control.\n\n## Componentes\n- PLC Siemens S7-1500\n- Variador de frecuencia',
    updatedAt: '2026-09-10T14:30:00.000Z',
  },
  {
    id: 'd2', projectId: 'PRY-2024-089', title: 'Acta de kickoff',
    kind: 'markdown',
    content:
      '# Acta de kickoff\n**Fecha:** 15 jul 2026\n\n## Acuerdos\n- [ ] Confirmar proveedor\n- [x] Definir alcance',
    updatedAt: '2026-07-16T09:00:00.000Z',
  },
];

@Injectable()
export class ProjectDocumentMockService implements ProjectDocumentService {
  getDocuments(projectId: string): Observable<ProjectDocument[]> {
    return of(MOCK_DOCUMENTS.filter((d) => d.projectId === projectId)).pipe(delay(150));
  }

  createDocument(doc: Omit<ProjectDocument, 'id'>): Observable<ProjectDocument> {
    const created: ProjectDocument = { ...doc, id: 'd' + Date.now() };
    MOCK_DOCUMENTS.push(created);
    return of(created).pipe(delay(150));
  }

  updateDocument(id: string, changes: Partial<ProjectDocument>): Observable<ProjectDocument> {
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
    MOCK_DOCUMENTS[idx] = { ...MOCK_DOCUMENTS[idx], ...changes };
    return of(MOCK_DOCUMENTS[idx]).pipe(delay(150));
  }

  deleteDocument(id: string): Observable<void> {
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
    if (idx !== -1) MOCK_DOCUMENTS.splice(idx, 1);
    return of(undefined).pipe(delay(150));
  }
}
