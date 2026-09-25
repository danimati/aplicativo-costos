import { Component, input } from '@angular/core';
import { StampComponent } from '../../shared/stamp/stamp.component';
import { BalancePanelComponent } from '../../shared/balance-panel/balance-panel.component';

interface GenericRow {
  folio: string;
  concept: string;
  owner: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-generic-view',
  // Ya no importamos 'standalone: true' ni 'CommonModule'
  imports: [StampComponent, BalancePanelComponent],
  templateUrl: './generic-view.component.html',
})
export class GenericViewComponent {
  title = input('');
  code = input('OPS');

  rows: GenericRow[] = [
    {
      folio: '01',
      concept: 'Parámetros base del proyecto',
      owner: 'A. Morales',
      status: 'VERIFICADO',
      date: '22 SEP 2026',
    },
    {
      folio: '02',
      concept: 'Registro operativo vigente',
      owner: 'J. Castañeda',
      status: 'EN CALIBRACIÓN',
      date: '21 SEP 2026',
    },
    {
      folio: '03',
      concept: 'Historial de modificación',
      owner: 'Control de costos',
      status: 'CONFORME',
      date: '18 SEP 2026',
    },
  ];
}
