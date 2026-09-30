import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceptionService } from '../reception.service';
import { ReceptionItem } from '../../models/reception.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ReceptionApiService implements ReceptionService {
  private http = inject(HttpClient);

  getByProject(projectId: string): Observable<ReceptionItem[]> {
    return this.http.get<ReceptionItem[]>(`${environment.apiUrl}/projects/${projectId}/reception`);
  }
}
