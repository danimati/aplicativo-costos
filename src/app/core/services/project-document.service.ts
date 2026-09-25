import { Observable } from 'rxjs';
import { ProjectDocument } from '../models/project.model';

export abstract class ProjectDocumentService {
  abstract getDocuments(projectId: string): Observable<ProjectDocument[]>;
  abstract createDocument(doc: Omit<ProjectDocument, 'id'>): Observable<ProjectDocument>;
  abstract updateDocument(
    id: string,
    changes: Partial<ProjectDocument>,
  ): Observable<ProjectDocument>;
  abstract deleteDocument(id: string): Observable<void>;
}
