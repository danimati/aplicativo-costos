import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-slide-panel',
  template: `
    @if (isOpen()) {
      <!-- Overlay oscuro de fondo -->
      <div class="slide-overlay" (click)="close.emit()"></div>

      <!-- Panel deslizable -->
      <aside class="slide-panel">
        <div class="slide-header">
          <strong>{{ title() }}</strong>
          <button class="slide-close" (click)="close.emit()">✕</button>
        </div>
        <div class="slide-content">
          <ng-content></ng-content>
        </div>
      </aside>
    }
  `,
  styleUrl: './slide-panel.component.css',
})
export class SlidePanelComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Panel');
  close = output<void>();
}
