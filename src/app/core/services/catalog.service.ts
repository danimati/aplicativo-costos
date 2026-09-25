import { Observable } from 'rxjs';
import { CatalogMaterial, CatalogProvider } from '../models/material.model';

export abstract class CatalogService {
  abstract getMaterials(): Observable<CatalogMaterial[]>;
  abstract getProviders(): Observable<CatalogProvider[]>;
}
