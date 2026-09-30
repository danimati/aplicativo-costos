// src/app/core/features/project-detail/pages/ciclo-i/mano-obra/mano-obra.page.ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { LaborService } from '../../../../../services/labor.service';
import { LaborStage } from '../../../../../models/labor.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';
import { BalancePanelComponent } from '../../../../../shared/balance-panel/balance-panel.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mano-obra',
  imports: [StampComponent, BalancePanelComponent, DecimalPipe],
  templateUrl: './mano-obra.page.html',
  styleUrl: './mano-obra.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManoObraPage {
  private route = inject(ActivatedRoute);
  private laborService = inject(LaborService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  stages = toSignal(this.projectId$.pipe(switchMap((id) => this.laborService.getByProject(id))), {
    initialValue: [] as LaborStage[],
  });

  totalHours = computed(() => this.stages().reduce((sum, s) => sum + s.estimatedHours, 0));
  totalCost = computed(() =>
    this.stages().reduce((sum, s) => sum + s.estimatedHours * s.hourlyRate, 0),
  );

  statusLabel(status: LaborStage['status']): string {
    return status;
  }
}
