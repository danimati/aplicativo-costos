import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs/operators';

import { ReportService } from '../../../../../services/report.service';
import { ProjectProgressReport } from '../../../../../models/report.model';
import { ProgressBarComponent } from '../../../../../shared/progress-bar/progress-bar.component';
import { BlockersPanelComponent } from '../../../../../shared/blockers-panel/blockers-panel.component';

@Component({
  selector: 'app-avance',
  imports: [ProgressBarComponent, BlockersPanelComponent],
  templateUrl: './avance.page.html',
  styleUrl: './avance.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvancePage {
  private readonly route = inject(ActivatedRoute);
  private readonly reportService = inject(ReportService);

  readonly projectId = toSignal(
    this.route.parent!.paramMap.pipe(map((params) => params.get('id') ?? '')),
    {
      initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
    },
  );

  readonly report = toSignal<ProjectProgressReport | null>(
    toObservable(this.projectId).pipe(
      filter((id) => id.length > 0),
      switchMap((id) => this.reportService.getAvance(id)),
    ),
    {
      initialValue: null,
    },
  );
}
