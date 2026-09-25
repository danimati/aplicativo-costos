import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { NavStateService } from '../../services/nav-state.service';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-project-detail',
  imports: [BackButtonComponent,RouterOutlet],
  template: `
    <div class="page-grid">
      <main class="document-main">
        <app-back-button />
        <router-outlet />
      </main>
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  public navState = inject(NavStateService);

  ngOnInit() {
    // Cargar la plantilla del proyecto
    this.route.paramMap
      .pipe(switchMap((params) => this.projectService.getProjectById(params.get('id')!)))
      .subscribe((project) => {
        if (project && project.navTemplate) {
          this.navState.loadTemplate(project.navTemplate);
        }
      });

    // Sincronizar menú si el usuario usa las flechas del navegador
    this.route.data.subscribe((data) => {
      if (data['cycle']) this.navState.activeCycle.set(data['cycle']);
      if (data['leaf']) this.navState.activeLeaf.set(data['leaf']);
    });
  }

  ngOnDestroy() {
    this.navState.clearTemplate();
  }
}
