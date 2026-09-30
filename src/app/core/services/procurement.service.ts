import { Observable } from 'rxjs';
import { ProcurementItem } from '../models/procurement.model';

export abstract class ProcurementService {
  abstract getByProject(projectId: string): Observable<ProcurementItem[]>;
}
