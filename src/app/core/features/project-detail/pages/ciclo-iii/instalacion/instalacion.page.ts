import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { InstallationService } from '../../../../../services/installation.service';
import { InstallationActivity } from '../../../../../models/installation.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';
import { ProgressBarComponent } from '../../../../../shared/progress-bar/progress-bar.component';

@Component({
  selector: 'app-instalacion',
  imports: [StampComponent, ProgressBarComponent, DatePipe],
  templateUrl: './instalacion.page.html',
  styleUrl: './instalacion.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstalacionPage {
  private route = inject(ActivatedRoute);
  private installationService = inject(InstallationService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  activities = toSignal(
    this.projectId$.pipe(switchMap((id) => this.installationService.getInstalacion(id))),
    { initialValue: [] as InstallationActivity[] },
  );
}
