import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Notification } from '../../models/notification.model';
import { NotificationService } from '../notification.service';

@Injectable()
export class NotificationApiService implements NotificationService {
  private http = inject(HttpClient);

  private readonly endpoint = '/api/notifications';

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.endpoint);
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.endpoint}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.endpoint}/read-all`, {});
  }
}
