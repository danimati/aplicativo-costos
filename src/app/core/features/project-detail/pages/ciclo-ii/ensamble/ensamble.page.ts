import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { ProductionService } from '../../../../../services/production.service';
import { AssemblyUnit } from '../../../../../models/production.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';
import { ProgressBarComponent } from '../../../../../shared/progress-bar/progress-bar.component';

@Component({
  selector: 'app-ensamble',
  imports: [StampComponent, ProgressBarComponent],
  templateUrl: './ensamble.page.html',
  styleUrl: './ensamble.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnsamblePage {
  private route = inject(ActivatedRoute);
  private productionService = inject(ProductionService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  units = toSignal(
    this.projectId$.pipe(switchMap((id) => this.productionService.getEnsamble(id))),
    { initialValue: [] as AssemblyUnit[] },
  );

  completedCount = computed(() => this.units().filter((u) => u.status === 'COMPLETADO').length);
  inProgressCount = computed(() => this.units().filter((u) => u.status === 'EN PROCESO').length);
  pendingCount = computed(
    () => this.units().filter((u) => u.status === 'PENDIENTE' || u.status === 'BLOQUEADO').length,
  );

  dependencyNames(unit: AssemblyUnit): string {
    if (unit.dependsOn.length === 0) return 'SIN DEPENDENCIAS';
    const names = unit.dependsOn
      .map((id) => this.units().find((u) => u.id === id)?.name)
      .filter((name): name is string => !!name);
    return names.join(', ');
  }
}
