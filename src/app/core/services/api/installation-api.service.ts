import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstallationService } from '../installation.service';
import { InstallationActivity } from '../../models/installation.model';
import { WiringCircuit } from '../../models/wiring.model';
import { ProgrammingEntry } from '../../models/programming.model';
import { TestCase } from '../../models/testing.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class InstallationApiService implements InstallationService {
  private http = inject(HttpClient);

  getInstalacion(projectId: string): Observable<InstallationActivity[]> {
    return this.http.get<InstallationActivity[]>(
      `${environment.apiUrl}/projects/${projectId}/instalacion`,
    );
  }

  getCableado(projectId: string): Observable<WiringCircuit[]> {
    return this.http.get<WiringCircuit[]>(`${environment.apiUrl}/projects/${projectId}/cableado`);
  }

  getProgramacion(projectId: string): Observable<ProgrammingEntry[]> {
    return this.http.get<ProgrammingEntry[]>(
      `${environment.apiUrl}/projects/${projectId}/programacion`,
    );
  }

  getPruebas(projectId: string): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(`${environment.apiUrl}/projects/${projectId}/pruebas`);
  }
}
