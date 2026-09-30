import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="progress-bar-wrap">
      @if (label()) {
        <div class="progress-bar-label">
          <span>{{ label() }}</span>
          <span class="mono">{{ clamped() }}%</span>
        </div>
      }
      <div
        class="progress-track"
        role="progressbar"
        [attr.aria-valuenow]="clamped()"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="label() || 'Avance'"
      >
        <span [style.width.%]="clamped()"></span>
      </div>
    </div>
  `,
  styleUrl: 'progress-bar.component.css',
})
export class ProgressBarComponent {
  value = input.required<number>();
  label = input<string>('');
  clamped = computed(() => Math.max(0, Math.min(100, Math.round(this.value()))));
}
