import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectNote } from '../../models/note.model';
import { environment } from '../../../../environments/environment';
import { ProjectNoteService } from '../project-notes.service';


@Injectable()
export class ProjectNoteApiService implements ProjectNoteService {
  private http = inject(HttpClient);

  getNotes(projectId: string): Observable<ProjectNote[]> {
    return this.http.get<ProjectNote[]>(`${environment.apiUrl}/projects/${projectId}/notes`);
  }

  createNote(note: Omit<ProjectNote, 'id'>): Observable<ProjectNote> {
    return this.http.post<ProjectNote>(
      `${environment.apiUrl}/projects/${note.projectId}/notes`,
      note,
    );
  }

  updateNote(id: string, changes: Partial<ProjectNote>): Observable<ProjectNote> {
    return this.http.patch<ProjectNote>(`${environment.apiUrl}/notes/${id}`, changes);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/notes/${id}`);
  }
}
