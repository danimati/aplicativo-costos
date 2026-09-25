import { Observable } from 'rxjs';
import { CalendarEvent, Project } from '../models/project.model';

export abstract class ProjectService {
  abstract getProjects(): Observable<Project[]>;
  abstract getProjectById(id: string): Observable<Project | undefined>;
  abstract getCalendarEvents(): Observable<CalendarEvent[]>;
}
