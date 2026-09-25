import { Component, inject, input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { NavStateService } from '../../services/nav-state.service';
import { AuthService } from '../../services/auth.service';
import { UiStateService } from '../../services/ui/ui-state.service';
import { StampComponent } from '../stamp/stamp.component';

@Component({
  selector: 'app-top-nav',
  imports: [StampComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  isRoot = input<boolean>(false);

  public navState = inject(NavStateService);
  public auth = inject(AuthService);
  public uiState = inject(UiStateService);

  private router = inject(Router);

  routeTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['title'] || 'EXPEDIENTE ACTIVO';
      }),
      startWith('EXPEDIENTE ACTIVO'),
    ),
  );

  navigateToLeaf(cycleId: string, leafId: string, route: string): void {
    this.navState.setCycle(cycleId);
    this.navState.navigateLeaf(leafId, route);

    const projectId = this.getProjectId();

    if (!projectId) {
      return;
    }

    this.router.navigate(['proyectos', projectId, route]);
  }

  private getProjectId(): string {
    let route = this.router.routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.snapshot.paramMap.get('id') ?? '';
  }
}
