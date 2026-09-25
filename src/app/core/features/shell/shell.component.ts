import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TopNavComponent } from '../../shared/top-nav/top-nav.component';
import { SlidePanelComponent } from '../../shared/slide-panel/slide-panel.component';
import { NavStateService } from '../../services/nav-state.service';
import { UiStateService } from '../../services/ui/ui-state.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TopNavComponent, SlidePanelComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public navState = inject(NavStateService);
  public uiState = inject(UiStateService);
  private router = inject(Router);

  private notificationService = inject(NotificationService);

  private isRootObs = this.route.firstChild
    ? this.route.firstChild.data.pipe(map((data) => !!data['isRoot']))
    : this.route.data.pipe(map((data) => !!data['isRoot']));

  isRoot = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return !!route.snapshot.data['isRoot'];
      }),
    ),
    { initialValue: true }, // <--- ESTO ELIMINA EL ERROR DE TYPESCRIPT
  );
  notifications = signal<Notification[]>([]);

  ngOnInit(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications.set(notifications);
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.read) {
      return;
    }
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.read = true;
      this.notifications.update((items) => [...items]);
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.update((items) =>
        items.map((item) => ({
          ...item,
          read: true,
        })),
      );
    });
  }
}
