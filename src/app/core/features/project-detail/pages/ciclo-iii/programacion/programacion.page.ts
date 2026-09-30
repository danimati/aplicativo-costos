import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { InstallationService } from '../../../../../services/installation.service';
import { ProgrammingEntry } from '../../../../../models/programming.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';

@Component({
  selector: 'app-programacion',
  imports: [StampComponent, DatePipe],
  templateUrl: './programacion.page.html',
  styleUrl: './programacion.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramacionPage {
  private route = inject(ActivatedRoute);
  private installationService = inject(InstallationService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  entries = toSignal(
    this.projectId$.pipe(switchMap((id) => this.installationService.getProgramacion(id))),
    { initialValue: [] as ProgrammingEntry[] },
  );

  completedMilestones(entry: ProgrammingEntry): number {
    return entry.milestones.filter((m) => m.done).length;
  }
}
