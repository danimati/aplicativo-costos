import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule],
})
export class LoginComponent {
  // estado local con signals
  showPassword = signal(false);
  error = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    this.error.set(false);
    this.auth.login();
    this.router.navigateByUrl('/app/proyectos');
  }
}
