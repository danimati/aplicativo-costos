import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  template: ` <button class="back-link" (click)="navigate()">← {{ label() }}</button> `,
  styleUrl: './back-button.component.css',
})
export class BackButtonComponent {
  label = input<string>('VOLVER AL PORTAFOLIO');
  route = input<string>('/proyectos');

  private router = inject(Router);

  navigate() {
    this.router.navigateByUrl(this.route());
  }
}
