import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { ReportService } from '../../../../../services/report.service';
import { ProjectIndicator } from '../../../../../models/report.model';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.page.html',
  styleUrl: './indicadores.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicadoresPage {
  private route = inject(ActivatedRoute);
  private reportService = inject(ReportService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  indicators = toSignal(
    this.projectId$.pipe(switchMap((id) => this.reportService.getIndicadores(id))),
    { initialValue: [] as ProjectIndicator[] },
  );
}
