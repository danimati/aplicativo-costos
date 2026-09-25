import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  isUserMenuOpen = signal(false);
  isNotificationsOpen = signal(false);
  isSettingsOpen = signal(false);

  openUserMenu(): void {
    this.isUserMenuOpen.set(true);
    this.isNotificationsOpen.set(false);
    this.isSettingsOpen.set(false);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((value) => !value);
  }

  openNotifications(): void {
    this.isNotificationsOpen.set(true);
    this.isUserMenuOpen.set(false);
    this.isSettingsOpen.set(false);
  }

  closeNotifications(): void {
    this.isNotificationsOpen.set(false);
  }

  toggleNotifications(): void {
    this.isNotificationsOpen.update((value) => !value);
  }

  openSettings(): void {
    this.isSettingsOpen.set(true);
    this.isUserMenuOpen.set(false);
    this.isNotificationsOpen.set(false);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  toggleSettings(): void {
    this.isSettingsOpen.update((value) => !value);
  }

  closeAll(): void {
    this.isUserMenuOpen.set(false);
    this.isNotificationsOpen.set(false);
    this.isSettingsOpen.set(false);
  }
}
