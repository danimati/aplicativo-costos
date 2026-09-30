import { Observable } from 'rxjs';
import { ProjectTemplateSnapshot } from '../models/project-template.model';

export abstract class ProjectTemplateService {
  abstract getByProject(projectId: string): Observable<ProjectTemplateSnapshot | null>;
}
