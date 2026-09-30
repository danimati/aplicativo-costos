import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pending-state',
  template: `
    <div class="pending-note" role="note">
      <span class="pending-tag">EN DESARROLLO</span>
      <span>{{ message() }}</span>
    </div>
  `,
  styleUrl: `./pending-state.component.css`,
})
export class PendingStateComponent {
  message = input<string>('Esta acción aún no está conectada a un backend.');
}
