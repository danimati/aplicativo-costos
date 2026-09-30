import { Observable } from 'rxjs';
import { ProjectCostInputs } from '../models/project-cost.model';

export abstract class ProjectCostService {
  abstract getByProject(projectId: string): Observable<ProjectCostInputs>;
}
