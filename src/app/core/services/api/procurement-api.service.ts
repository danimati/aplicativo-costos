import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcurementService } from '../procurement.service';
import { ProcurementItem } from '../../models/procurement.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProcurementApiService implements ProcurementService {
  private http = inject(HttpClient);

  getByProject(projectId: string): Observable<ProcurementItem[]> {
    return this.http.get<ProcurementItem[]>(
      `${environment.apiUrl}/projects/${projectId}/procurement`,
    );
  }
}
