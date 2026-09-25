import { Observable } from 'rxjs';
import { ProjectNote } from '../models/note.model';

export abstract class ProjectNoteService {
  abstract getNotes(projectId: string): Observable<ProjectNote[]>;
  abstract createNote(note: Omit<ProjectNote, 'id'>): Observable<ProjectNote>;
  abstract updateNote(id: string, changes: Partial<ProjectNote>): Observable<ProjectNote>;
  abstract deleteNote(id: string): Observable<void>;
}
