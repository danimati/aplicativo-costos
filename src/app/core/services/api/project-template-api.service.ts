import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectTemplateService } from '../project-template.service';
import { ProjectTemplateSnapshot } from '../../models/project-template.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProjectTemplateApiService implements ProjectTemplateService {
  private http = inject(HttpClient);

  getByProject(projectId: string): Observable<ProjectTemplateSnapshot | null> {
    return this.http.get<ProjectTemplateSnapshot | null>(
      `${environment.apiUrl}/projects/${projectId}/template`,
    );
  }
}
