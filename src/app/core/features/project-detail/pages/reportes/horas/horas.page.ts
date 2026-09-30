import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { ReportService } from '../../../../../services/report.service';
import { ProjectHoursReport } from '../../../../../models/report.model';

@Component({
  selector: 'app-horas',
  imports: [DecimalPipe],
  templateUrl: './horas.page.html',
  styleUrl: './horas.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorasPage {
  private readonly route = inject(ActivatedRoute);
  private readonly reportService = inject(ReportService);

  readonly projectId = toSignal(
    this.route.parent!.paramMap.pipe(map((params) => params.get('id') ?? '')),
    {
      initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
    },
  );

  readonly report = toSignal<ProjectHoursReport | null>(
    toObservable(this.projectId).pipe(switchMap((id) => this.reportService.getHoras(id))),
    {
      initialValue: null,
    },
  );
}
