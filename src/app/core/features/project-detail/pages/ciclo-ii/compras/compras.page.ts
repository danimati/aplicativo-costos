import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ProcurementService } from '../../../../../services/procurement.service';
import { ProcurementItem } from '../../../../../models/procurement.model';
import { StampComponent } from '../../../../../shared/stamp/stamp.component';

@Component({
  selector: 'app-compras',
  imports: [StampComponent, DatePipe, DecimalPipe],
  templateUrl: './compras.page.html',
  styleUrl: './compras.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComprasPage {
  private route = inject(ActivatedRoute);
  private procurementService = inject(ProcurementService);

  projectId = toSignal(this.route.parent!.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: this.route.parent?.snapshot.paramMap.get('id') ?? '',
  });

  private projectId$ = toObservable(this.projectId);

  items = toSignal(
    this.projectId$.pipe(switchMap((id) => this.procurementService.getByProject(id))),
    { initialValue: [] as ProcurementItem[] },
  );

  private netUnitPrice(item: ProcurementItem): number {
    return item.unitPrice * (1 - item.discountPercent / 100);
  }

  requestedValue = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity * this.netUnitPrice(i), 0),
  );

  receivedValue = computed(() =>
    this.items().reduce((sum, i) => sum + i.receivedQuantity * this.netUnitPrice(i), 0),
  );

  netPrice(item: ProcurementItem): number {
    return this.netUnitPrice(item);
  }
}
