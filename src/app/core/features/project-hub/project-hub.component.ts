import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalendarEvent, Project } from '../../models/project.model';
import { StampComponent } from '../../shared/stamp/stamp.component';
import { NotesModalComponent } from './components/notes-modal/notes-modal.component';
import { MonthCalendarComponent } from './components/month-calendar/month-calendar.component';
import { ProjectNoteService } from '../../services/project-notes.service';
import { ProjectNotesService } from '../../services/ui/project-notes.service';

@Component({
  selector: 'app-project-hub',
  imports: [
    StampComponent,
    NotesModalComponent,
    MonthCalendarComponent,
  ],
  templateUrl: './project-hub.component.html',
  styleUrl: './project-hub.component.css',
})
export class ProjectHubComponent {
  //Inyección
  private projectService = inject(ProjectService);
  private router = inject(Router);
  public notesSvc = inject(ProjectNotesService);

  projects = toSignal(this.projectService.getProjects(), { initialValue: [] as Project[] });
  calendar = toSignal(this.projectService.getCalendarEvents(), {
    initialValue: [] as CalendarEvent[],
  });

  days = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, '0'));

  openProject(project: Project): void {
    if (project.id === 'PRY-2024-089') {
      this.router.navigate(['/app/proyectos', project.id]);
    }
  }

  eventFor(day: string, events: CalendarEvent[]): CalendarEvent | undefined {
    return events.find((e) => e.day === day);
  }

  addNoteToProject(p: Project, ev: Event) {
    ev.stopPropagation(); // que no dispare openProject(p)
    const today = new Date().toISOString().slice(0, 10);
    this.notesSvc.openNoteModal(today, p.id);
  }

  openProjectById(id: string) {
    const p = this.projects().find((pr) => pr.id === id);
    if (p) this.openProject(p);
  }
}
