import { Component } from '@angular/core';

@Component({
  selector: 'app-balance-panel',
  standalone: true,
  templateUrl: './balance-panel.component.html',
  styleUrl: './balance-panel.component.css',
})
export class BalancePanelComponent {
  // TODO: CostSummaryService inyectado.
  readonly summary = {
    exactMaterials: '$ 18,220.00',
    estimatedMaterials: '$ 4,344.00',
    labor: '$ 9,840.00',
    overhead: '$ 2,180.00',
    total: '$ 34,584.00',
  };
}
