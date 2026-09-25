export interface Notification {
  id: string;
  date: string;
  message: string;
  read: boolean;
  projectId?: string;
}
