import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportService } from '../report.service';
import {
  ProjectProgressReport,
  ProjectCostReport,
  ProjectHoursReport,
  ProjectIndicator,
} from '../../models/report.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ReportApiService implements ReportService {
  private http = inject(HttpClient);

  getAvance(projectId: string): Observable<ProjectProgressReport> {
    return this.http.get<ProjectProgressReport>(
      `${environment.apiUrl}/projects/${projectId}/reports/avance`,
    );
  }

  getCostos(projectId: string): Observable<ProjectCostReport> {
    return this.http.get<ProjectCostReport>(
      `${environment.apiUrl}/projects/${projectId}/reports/costos`,
    );
  }

  getHoras(projectId: string): Observable<ProjectHoursReport> {
    return this.http.get<ProjectHoursReport>(
      `${environment.apiUrl}/projects/${projectId}/reports/horas`,
    );
  }

  getIndicadores(projectId: string): Observable<ProjectIndicator[]> {
    return this.http.get<ProjectIndicator[]>(
      `${environment.apiUrl}/projects/${projectId}/reports/indicadores`,
    );
  }
}
