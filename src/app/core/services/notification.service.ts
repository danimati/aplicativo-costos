import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

export abstract class NotificationService {
  abstract getNotifications(): Observable<Notification[]>;
  abstract markAsRead(id: string): Observable<void>;
  abstract markAllAsRead(): Observable<void>;
}
