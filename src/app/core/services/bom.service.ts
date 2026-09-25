import { Observable } from 'rxjs';
import { BomMaterial } from '../models/material.model';

export abstract class BomService {
  abstract getMaterials(projectId: string): Observable<BomMaterial[]>;
}
