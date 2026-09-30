import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { ReportService } from '../../../../../services/report.service';
import { ProjectCostReport } from '../../../../../models/report.model';

@Component({
  selector: 'app-costos',
  imports: [DecimalPipe],
  templateUrl: './costos.page.html',
  styleUrl: './costos.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostosPage {
  private readonly route = inject(ActivatedRoute);
  private readonly reportService = inject(ReportService);

  readonly projectId = toSignal(
    this.route.parent!.paramMap.pipe(map((params) => params.get('id') ?? '')),
    {
      initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
    },
  );

  readonly report = toSignal<ProjectCostReport | null>(
    toObservable(this.projectId).pipe(switchMap((id) => this.reportService.getCostos(id))),
    {
      initialValue: null,
    },
  );

  percentOf(amount: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Math.round((amount / total) * 100);
  }
}
