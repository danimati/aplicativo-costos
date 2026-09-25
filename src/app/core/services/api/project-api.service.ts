import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectService } from '../project.service';
import { CalendarEvent, Project } from '../../models/project.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProjectApiService implements ProjectService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/projects`;

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.base);
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this.http.get<Project>(`${this.base}/${id}`);
  }

  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.base}/calendar`);
  }
}
