import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ProductionService } from '../../../../../services/production.service';
import { ProductionActivity } from '../../../../../models/production.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';
import { ProgressBarComponent } from '../../../../../shared/progress-bar/progress-bar.component';

@Component({
  selector: 'app-fabricacion',
  imports: [StampComponent, ProgressBarComponent, DatePipe],
  templateUrl: './fabricacion.page.html',
  styleUrl: './fabricacion.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabricacionPage {
  private route = inject(ActivatedRoute);
  private productionService = inject(ProductionService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  activities = toSignal(
    this.projectId$.pipe(switchMap((id) => this.productionService.getFabricacion(id))),
    { initialValue: [] as ProductionActivity[] },
  );

  overallProgress = computed(() => {
    const list = this.activities();
    if (list.length === 0) return 0;
    return Math.round(list.reduce((sum, a) => sum + a.progress, 0) / list.length);
  });
}
