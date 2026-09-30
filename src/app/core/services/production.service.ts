import { Observable } from 'rxjs';
import { ProductionActivity, AssemblyUnit } from '../models/production.model';

export abstract class ProductionService {
  abstract getFabricacion(projectId: string): Observable<ProductionActivity[]>;
  abstract getEnsamble(projectId: string): Observable<AssemblyUnit[]>;
}
