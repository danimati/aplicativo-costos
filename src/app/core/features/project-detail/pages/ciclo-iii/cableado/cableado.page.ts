import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { InstallationService } from '../../../../../services/installation.service';
import { WiringCircuit } from '../../../../../models/wiring.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';

@Component({
  selector: 'app-cableado',
  imports: [StampComponent],
  templateUrl: './cableado.page.html',
  styleUrl: './cableado.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CableadoPage {
  private route = inject(ActivatedRoute);
  private installationService = inject(InstallationService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  circuits = toSignal(
    this.projectId$.pipe(switchMap((id) => this.installationService.getCableado(id))),
    { initialValue: [] as WiringCircuit[] },
  );

  completedCount = computed(
    () => this.circuits().filter((c) => c.status === 'CONECTADO' || c.status === 'APROBADO').length,
  );
  pendingQcCount = computed(() => this.circuits().filter((c) => c.qcPending).length);
}
