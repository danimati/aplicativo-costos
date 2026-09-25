import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BomService } from '../bom.service';
import { BomMaterial } from '../../models/material.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class BomApiService implements BomService {
  private http = inject(HttpClient);

  getMaterials(projectId: string): Observable<BomMaterial[]> {
    return this.http.get<BomMaterial[]>(`${environment.apiUrl}/projects/${projectId}/bom`);
  }
}
