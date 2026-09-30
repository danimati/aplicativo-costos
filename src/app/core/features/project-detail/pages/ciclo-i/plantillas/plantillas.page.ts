import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ProjectTemplateService } from '../../../../../services/project-template.service';
import { ProjectTemplateSnapshot } from '../../../../../models/project-template.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';
import { PendingStateComponent } from '../../../../../shared/pending-state/pending-state.component';

@Component({
  selector: 'app-plantillas',
  imports: [StampComponent, PendingStateComponent, DatePipe],
  templateUrl: './plantillas.page.html',
  styleUrl: './plantillas.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantillasPage {
  private route = inject(ActivatedRoute);
  private templateService = inject(ProjectTemplateService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  template = toSignal(
    this.projectId$.pipe(switchMap((id) => this.templateService.getByProject(id))),
    { initialValue: null as ProjectTemplateSnapshot | null },
  );
}
