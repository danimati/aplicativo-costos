import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<{ initials: string; name: string; role: string }>({
    initials: 'AM',
    name: 'Andrea M.',
    role: 'Financiero',
  });

  readonly isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();

  login(): void {
    // Mock: valida cualquier credencial. Cuando exista backend real,
    // reemplaza esto por una llamada http y setea el resultado.
    this.loggedInSubject.next(true);
  }

  logout(): void {
    this.loggedInSubject.next(false);
  }
}
