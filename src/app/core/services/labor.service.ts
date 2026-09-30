import { Observable } from 'rxjs';
import { LaborStage } from '../models/labor.model';

export abstract class LaborService {
  abstract getByProject(projectId: string): Observable<LaborStage[]>;
}
