import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Notification } from '../../models/notification.model';
import { NotificationService } from '../notification.service';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    date: '22 SEP 2026 / 14:32',
    message: 'Nuevo corte de material registrado',
    read: false,
    projectId: 'PRY-2024-089',
  },
  {
    id: 'NOT-002',
    date: '22 SEP 2026 / 11:18',
    message: 'La BOM del proyecto fue actualizada',
    read: false,
    projectId: 'PRY-2024-089',
  },
  {
    id: 'NOT-003',
    date: '21 SEP 2026 / 16:45',
    message: 'Orden de compra recibida en taller',
    read: true,
    projectId: 'PRY-2024-076',
  },
];

@Injectable()
export class NotificationMockService implements NotificationService {
  private notifications = [...MOCK_NOTIFICATIONS];

  getNotifications(): Observable<Notification[]> {
    return of(this.notifications).pipe(delay(150));
  }

  markAsRead(id: string): Observable<void> {
    const notification = this.notifications.find((item) => item.id === id);

    if (notification) {
      notification.read = true;
    }

    return of(void 0).pipe(delay(100));
  }

  markAllAsRead(): Observable<void> {
    this.notifications.forEach((notification) => (notification.read = true));

    return of(void 0).pipe(delay(100));
  }
}
