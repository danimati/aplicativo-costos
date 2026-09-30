import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LaborService } from '../labor.service';
import { LaborStage } from '../../models/labor.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LaborApiService implements LaborService {
  private http = inject(HttpClient);

  getByProject(projectId: string): Observable<LaborStage[]> {
    return this.http.get<LaborStage[]>(`${environment.apiUrl}/projects/${projectId}/labor-stages`);
  }
}
