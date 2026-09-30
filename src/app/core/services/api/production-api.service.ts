import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionService } from '../production.service';
import { ProductionActivity, AssemblyUnit } from '../../models/production.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProductionApiService implements ProductionService {
  private http = inject(HttpClient);

  getFabricacion(projectId: string): Observable<ProductionActivity[]> {
    return this.http.get<ProductionActivity[]>(
      `${environment.apiUrl}/projects/${projectId}/fabricacion`,
    );
  }

  getEnsamble(projectId: string): Observable<AssemblyUnit[]> {
    return this.http.get<AssemblyUnit[]>(`${environment.apiUrl}/projects/${projectId}/ensamble`);
  }
}
