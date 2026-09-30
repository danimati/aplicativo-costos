import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ReceptionService } from '../../../../../services/reception.service';
import { ReceptionItem } from '../../../../../models/reception.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';

@Component({
  selector: 'app-recepcion',
  imports: [StampComponent, DatePipe],
  templateUrl: './recepcion.page.html',
  styleUrl: './recepcion.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecepcionPage {
  private route = inject(ActivatedRoute);
  private receptionService = inject(ReceptionService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  items = toSignal(
    this.projectId$.pipe(switchMap((id) => this.receptionService.getByProject(id))),
    { initialValue: [] as ReceptionItem[] },
  );

  pendingQuantity(item: ReceptionItem): number {
    return Math.max(0, item.requestedQuantity - item.receivedQuantity);
  }

  incidentsCount = computed(
    () => this.items().filter((i) => i.status === 'INCIDENCIA' || i.status === 'RECHAZADO').length,
  );
}
