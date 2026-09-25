import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CalendarEvent, Project } from '../../models/project.model';
import { StampComponent } from '../../shared/stamp/stamp.component';

@Component({
  selector: 'app-project-hub',
  imports: [StampComponent],
  templateUrl: './project-hub.component.html',
  styleUrl: './project-hub.component.css',
})
export class ProjectHubComponent {
  // 1. Inyección moderna
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects = toSignal(this.projectService.getProjects(), { initialValue: [] as Project[] });
  calendar = toSignal(this.projectService.getCalendarEvents(), {
    initialValue: [] as CalendarEvent[],
  });

  days = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, '0'));

  openProject(project: Project): void {
    if (project.id === 'PRY-2024-089') {
      this.router.navigate(['/proyectos', project.id]);
    }
  }

  eventFor(day: string, events: CalendarEvent[]): CalendarEvent | undefined {
    return events.find((e) => e.day === day);
  }
}
