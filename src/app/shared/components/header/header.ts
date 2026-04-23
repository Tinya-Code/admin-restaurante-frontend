import { RouterLink, Router } from '@angular/router';
import { Component, signal, ChangeDetectionStrategy, inject,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogOut, User, Settings, ChevronDown, Store, RefreshCcw } from 'lucide-angular';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';

import { NotificationService } from '../../../core/services/notification.service';
interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}
@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);
  public readonly tenantService = inject(TenantService);

  // Icons
  readonly logOutIcon = LogOut;
  readonly userIcon = User;
  readonly settingsIcon = Settings;
  readonly chevronDownIcon = ChevronDown;
  readonly refreshIcon = RefreshCcw;

  // State
  readonly isMenuOpen = signal(false);
  readonly user = this.authState.user;

  // Config
  readonly appLogo = signal<string>(
    'https://i.pinimg.com/736x/67/ac/89/67ac897b4b12c0d82a8c1c6d9c79287d.jpg'
  );
  readonly clientLogo = signal<string | null>(null);

  getUserInitials(): string {
    const currentUser = this.user();
    if (!currentUser || !currentUser.displayName) return '??';
    
    const names = currentUser.displayName.trim().split(/\s+/);
    if (names.length === 0) return '??';
    
    if (names.length === 1) {
      return names[0].slice(0, 2).toUpperCase();
    }
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((state) => !state);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  async logout(): Promise<void> {
    try {
      this.notification.info('Cerrando sesión...');
      this.closeMenu();
      await this.authService.closeSession();
    } catch (error) {
      console.error('Logout error:', error);
      this.notification.error('Error al cerrar sesión');
    }
  }

  goToProfile(): void {
    this.router.navigate(['/admin/settings']);
    this.closeMenu();
  }

  goToSettings(): void {
    this.router.navigate(['/admin/settings']);
    this.closeMenu();
  }

  changeRestaurant(): void {
    // Solo dirigimos al selector en vez de borrar toda la sesión (lo cual borraba auth y listados)
    this.router.navigate(['/auth/select-restaurant']);
    this.closeMenu();
  }

  getDisplayLogo(): string {
    return this.clientLogo() || this.appLogo();
  }
}
