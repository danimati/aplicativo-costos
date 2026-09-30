import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProjectCostService } from '../project-cost.service';
import { ProjectCostInputs } from '../../models/project-cost.model';

const MOCK: Record<string, ProjectCostInputs> = {
  'PRY-2024-089': {
    projectId: 'PRY-2024-089',
    fixedCosts: 3200000,
    variableCosts: 1450000,
    indirectCosts: 980000,
    marginPercent: 22,
  },
  'PRY-2024-076': {
    projectId: 'PRY-2024-076',
    fixedCosts: 2100000,
    variableCosts: 900000,
    indirectCosts: 640000,
    marginPercent: 18,
  },
};

const DEFAULT: ProjectCostInputs = {
  projectId: '',
  fixedCosts: 0,
  variableCosts: 0,
  indirectCosts: 0,
  marginPercent: 0,
};

@Injectable()
export class ProjectCostMockService implements ProjectCostService {
  getByProject(projectId: string): Observable<ProjectCostInputs> {
    return of(MOCK[projectId] ?? { ...DEFAULT, projectId }).pipe(delay(150));
  }
}
