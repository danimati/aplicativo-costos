import { Observable } from 'rxjs';
import { ReceptionItem } from '../models/reception.model';

export abstract class ReceptionService {
  abstract getByProject(projectId: string): Observable<ReceptionItem[]>;
}
