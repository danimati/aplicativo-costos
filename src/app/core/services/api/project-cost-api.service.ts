import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectCostService } from '../project-cost.service';
import { ProjectCostInputs } from '../../models/project-cost.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProjectCostApiService implements ProjectCostService {
  private http = inject(HttpClient);

  getByProject(projectId: string): Observable<ProjectCostInputs> {
    return this.http.get<ProjectCostInputs>(
      `${environment.apiUrl}/projects/${projectId}/cost-inputs`,
    );
  }
}
