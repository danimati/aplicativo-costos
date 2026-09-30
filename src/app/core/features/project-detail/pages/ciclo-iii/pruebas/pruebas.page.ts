import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { InstallationService } from '../../../../../services/installation.service';
import { TestCase } from '../../../../../models/testing.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';

@Component({
  selector: 'app-pruebas',
  imports: [StampComponent, DatePipe],
  templateUrl: './pruebas.page.html',
  styleUrl: './pruebas.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PruebasPage {
  private route = inject(ActivatedRoute);
  private installationService = inject(InstallationService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  tests = toSignal(
    this.projectId$.pipe(switchMap((id) => this.installationService.getPruebas(id))),
    { initialValue: [] as TestCase[] },
  );

  approvedCount = computed(() => this.tests().filter((t) => t.result === 'APROBADA').length);
  pendingCount = computed(() => this.tests().filter((t) => t.result === 'PENDIENTE').length);
}
