import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogService } from '../catalog.service';
import { CatalogMaterial, CatalogProvider } from '../../models/material.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CatalogApiService implements CatalogService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/catalog`;

  getMaterials(): Observable<CatalogMaterial[]> {
    return this.http.get<CatalogMaterial[]>(`${this.base}/materials`);
  }
  getProviders(): Observable<CatalogProvider[]> {
    return this.http.get<CatalogProvider[]>(`${this.base}/providers`);
  }
}
