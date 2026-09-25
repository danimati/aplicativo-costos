import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stamp',
  standalone: true,
  template: `<span class="stamp" [class.stamp-copper]="copperText"
    ><ng-content></ng-content
  ></span>`,
})
export class StampComponent {
  @Input() copperText = false;
}
