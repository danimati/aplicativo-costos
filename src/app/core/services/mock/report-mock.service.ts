import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportService } from '../report.service';
import { BomService } from '../bom.service';
import { LaborService } from '../labor.service';
import { ProductionService } from '../production.service';
import { InstallationService } from '../installation.service';
import { ProjectCostService } from '../project-cost.service';
import { ProcurementService } from '../procurement.service';
import {
  ProjectProgressReport,
  CycleProgress,
  ProjectCostReport,
  CostBreakdownItem,
  ProjectHoursReport,
  ProjectIndicator,
  ProgressMilestone,
} from '../../models/report.model';
import { LaborStage } from '../../models/labor.model';

@Injectable()
export class ReportMockService implements ReportService {
  private bomService = inject(BomService);
  private laborService = inject(LaborService);
  private productionService = inject(ProductionService);
  private installationService = inject(InstallationService);
  private costService = inject(ProjectCostService);
  private procurementService = inject(ProcurementService);

  getAvance(projectId: string): Observable<ProjectProgressReport> {
    if (!projectId) {
      return of({
        overallProgress: 0,
        cycles: [],
        milestones: [],
        blockers: [],
      });
    }

    return combineLatest([
      this.laborService.getByProject(projectId),
      this.productionService.getFabricacion(projectId),
      this.productionService.getEnsamble(projectId),
      this.installationService.getInstalacion(projectId),
      this.installationService.getProgramacion(projectId),
    ]).pipe(
      map(([labor, fabricacion, ensamble, instalacion, programacion]) => {
        const laborProgress = this.averageLaborProgress(labor);

        const cicloIIProgress = this.average([
          ...fabricacion.map((f) => f.progress),
          ...ensamble.map((e) => e.progress),
        ]);

        const cicloIIIProgress = this.average(instalacion.map((i) => i.progress));

        const cycles: CycleProgress[] = [
          { cycle: 'CICLO I', progress: Math.round(laborProgress) },
          { cycle: 'CICLO II', progress: Math.round(cicloIIProgress) },
          { cycle: 'CICLO III', progress: Math.round(cicloIIIProgress) },
        ];

        const overallProgress = Math.round(this.average(cycles.map((c) => c.progress)));

        const milestones: ProgressMilestone[] = programacion.flatMap((p) =>
          p.milestones.map((m) => ({
            label: m.label,
            done: m.done,
            date: p.reviewDate,
          })),
        );

        const blockers: string[] = [
          ...ensamble.filter((e) => e.status === 'BLOQUEADO').map((e) => `Bloqueado: ${e.name}`),
          ...programacion.filter((p) => !!p.blockers).map((p) => p.blockers as string),
        ];

        return {
          overallProgress,
          cycles,
          milestones,
          blockers,
        };
      }),
    );
  }

  getCostos(projectId: string): Observable<ProjectCostReport> {
    if (!projectId) {
      return of({
        materials: 0,
        labor: 0,
        fixedCosts: 0,
        variableCosts: 0,
        indirectCosts: 0,
        totalCost: 0,
        marginPercent: 0,
        estimatedProfit: 0,
        finalEstimatedValue: 0,
        breakdown: [],
        actualCostAvailable: false,
      });
    }

    return combineLatest([
      this.bomService.getMaterials(projectId),
      this.laborService.getByProject(projectId),
      this.costService.getByProject(projectId),
    ]).pipe(
      map(([materials, laborStages, costInputs]) => {
        // El tipo explícito evita la ambigüedad de overload de reduce.
        const materialsCost = materials.reduce<number>(
          (sum, m) => sum + Number(m.subtotal ?? 0),
          0,
        );

        const laborCost = laborStages.reduce<number>(
          (sum, s) => sum + Number(s.estimatedHours ?? 0) * Number(s.hourlyRate ?? 0),
          0,
        );

        const fixedCosts = Number(costInputs.fixedCosts ?? 0);
        const variableCosts = Number(costInputs.variableCosts ?? 0);
        const indirectCosts = Number(costInputs.indirectCosts ?? 0);
        const marginPercent = Number(costInputs.marginPercent ?? 0);

        const totalCost = materialsCost + laborCost + fixedCosts + variableCosts + indirectCosts;

        const estimatedProfit = totalCost * (marginPercent / 100);
        const finalEstimatedValue = totalCost + estimatedProfit;

        const breakdown: CostBreakdownItem[] = [
          { label: 'Materiales', amount: materialsCost },
          { label: 'Mano de obra', amount: laborCost },
          { label: 'Costos fijos asignados', amount: fixedCosts },
          { label: 'Costos variables', amount: variableCosts },
          { label: 'Costos indirectos', amount: indirectCosts },
        ];

        return {
          materials: materialsCost,
          labor: laborCost,
          fixedCosts,
          variableCosts,
          indirectCosts,
          totalCost,
          marginPercent,
          estimatedProfit,
          finalEstimatedValue,
          breakdown,
          actualCostAvailable: false,
        };
      }),
    );
  }

  getHoras(projectId: string): Observable<ProjectHoursReport> {
    if (!projectId) {
      return of({
        stages: [],
        totalHours: 0,
        totalCost: 0,
        capacityStatus: 'PENDIENTE_DE_CARACTERIZACION',
      });
    }

    return this.laborService.getByProject(projectId).pipe(
      map((stages) => {
        const mapped = stages.map((s) => {
          const hours = Number(s.estimatedHours ?? 0);
          const hourlyRate = Number(s.hourlyRate ?? 0);

          return {
            name: s.name,
            hours,
            hourlyRate,
            cost: hours * hourlyRate,
          };
        });

        return {
          stages: mapped,
          totalHours: mapped.reduce<number>((sum, s) => sum + s.hours, 0),
          totalCost: mapped.reduce<number>((sum, s) => sum + s.cost, 0),
          capacityStatus: 'PENDIENTE_DE_CARACTERIZACION',
        };
      }),
    );
  }

  getIndicadores(projectId: string): Observable<ProjectIndicator[]> {
    if (!projectId) {
      return of([]);
    }

    return combineLatest([
      this.getAvance(projectId),
      this.getCostos(projectId),
      this.getHoras(projectId),
      this.procurementService.getByProject(projectId),
      this.installationService.getPruebas(projectId),
    ]).pipe(
      map(([avance, costos, horas, procurement, pruebas]) => {
        const pendingProcurement = procurement.filter((p) => p.status !== 'COMPLETO').length;

        const approvedTests = pruebas.filter((t) => t.result === 'APROBADA').length;

        const indicators: ProjectIndicator[] = [
          {
            id: 'ind-avance',
            label: 'Avance general',
            value: `${avance.overallProgress}%`,
            source: 'Avance del proyecto',
            isDemo: true,
          },
          {
            id: 'ind-costo',
            label: 'Costo total estimado',
            value: `$ ${Math.round(costos.totalCost).toLocaleString('es-CO')}`,
            source: 'Costos',
            isDemo: true,
          },
          {
            id: 'ind-horas',
            label: 'Horas proyectadas',
            value: `${horas.totalHours} h`,
            source: 'Mano de obra',
            isDemo: true,
          },
          {
            id: 'ind-compras',
            label: 'Compras pendientes',
            value: `${pendingProcurement}`,
            source: 'Compras',
            isDemo: true,
          },
          {
            id: 'ind-pruebas',
            label: 'Pruebas aprobadas',
            value: `${approvedTests} / ${pruebas.length}`,
            source: 'Pruebas',
            isDemo: true,
          },
        ];

        return indicators;
      }),
    );
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    return values.reduce<number>((sum, value) => sum + value, 0) / values.length;
  }

  private averageLaborProgress(stages: LaborStage[]): number {
    const mapped = stages.map((s) =>
      s.status === 'COMPLETADO' ? 100 : s.status === 'EN PROCESO' ? 50 : 0,
    );

    return this.average(mapped);
  }
}
