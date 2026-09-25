import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ProjectNote } from '../../models/note.model';
import { ProjectNoteService } from '../project-notes.service';

const MOCK_NOTES: ProjectNote[] = [
  {
    id: 'n1',
    projectId: 'PRY-2024-089',
    date: '2026-09-22',
    content:
      '# Corte de Costos\n- Revisar BOM\n- [ ] Aprobar gastos **extraordinarios**\n- [x] Enviar borrador',
  },
];

@Injectable()
export class ProjectNoteMockService implements ProjectNoteService {
  getNotes(projectId: string): Observable<ProjectNote[]> {
    return of(MOCK_NOTES.filter((n) => n.projectId === projectId)).pipe(delay(150));
  }

  createNote(note: Omit<ProjectNote, 'id'>): Observable<ProjectNote> {
    const created: ProjectNote = { ...note, id: 'n' + Date.now() };
    MOCK_NOTES.push(created);
    return of(created).pipe(delay(150));
  }

  updateNote(id: string, changes: Partial<ProjectNote>): Observable<ProjectNote> {
    const idx = MOCK_NOTES.findIndex((n) => n.id === id);
    MOCK_NOTES[idx] = { ...MOCK_NOTES[idx], ...changes };
    return of(MOCK_NOTES[idx]).pipe(delay(150));
  }

  deleteNote(id: string): Observable<void> {
    const idx = MOCK_NOTES.findIndex((n) => n.id === id);
    if (idx !== -1) MOCK_NOTES.splice(idx, 1);
    return of(undefined).pipe(delay(150));
  }
}
