import { Component, input } from '@angular/core';

@Component({
  selector: 'app-blockers-panel',
  template: `
    @if (items().length > 0) {
      <div class="blockers-panel" role="alert">
        <span class="folio-label">BLOQUEOS / INCIDENCIAS</span>
        <ul>
          @for (item of items(); track $index) {
            <li>{{ item }}</li>
          }
        </ul>
      </div>
    }
  `,
  styleUrl:'./blockers-panel.component.css'
})
export class BlockersPanelComponent {
  items = input.required<string[]>();
}
