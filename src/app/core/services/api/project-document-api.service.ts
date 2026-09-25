import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDocument } from '../../models/project.model';
import { environment } from '../../../../environments/environment';
import { ProjectDocumentService } from '../project-document.service';

@Injectable()
export class ProjectDocumentApiService implements ProjectDocumentService {
  private http = inject(HttpClient);

  getDocuments(projectId: string): Observable<ProjectDocument[]> {
    return this.http.get<ProjectDocument[]>(
      `${environment.apiUrl}/projects/${projectId}/documents`,
    );
  }

  createDocument(doc: Omit<ProjectDocument, 'id'>): Observable<ProjectDocument> {
    return this.http.post<ProjectDocument>(
      `${environment.apiUrl}/projects/${doc.projectId}/documents`,
      doc,
    );
  }

  updateDocument(id: string, changes: Partial<ProjectDocument>): Observable<ProjectDocument> {
    return this.http.patch<ProjectDocument>(`${environment.apiUrl}/documents/${id}`, changes);
  }

  deleteDocument(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/documents/${id}`);
  }
}
