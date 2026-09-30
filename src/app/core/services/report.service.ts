import { Observable } from 'rxjs';
import {
  ProjectProgressReport,
  ProjectCostReport,
  ProjectHoursReport,
  ProjectIndicator,
} from '../models/report.model';

export abstract class ReportService {
  abstract getAvance(projectId: string): Observable<ProjectProgressReport>;
  abstract getCostos(projectId: string): Observable<ProjectCostReport>;
  abstract getHoras(projectId: string): Observable<ProjectHoursReport>;
  abstract getIndicadores(projectId: string): Observable<ProjectIndicator[]>;
}
