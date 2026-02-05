import { RouterLink, Router } from '@angular/router';
import { Component, signal, ChangeDetectionStrategy, inject,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogOut, User, Settings, ChevronDown, Route as RouteIcon } from 'lucide-angular';
import { Auth } from '../../../core/services/auth';

import { Notification } from '../../../core/services/notification';
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
  private notification= inject(Notification);
  private router = inject(Router);
  private auth = inject(Auth);
  isOpen = false;


  readonly logOut = LogOut;
  readonly userIcon = User;
  readonly settings = Settings;
  readonly chevronDown = ChevronDown;
  // State
  readonly isMenuOpen = signal(false);
 readonly user = this.auth.user;
  getUserInitials(): string {
    const currentUser = this.user();
    if (!currentUser) return '';
    return currentUser.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Config
  readonly appLogo = signal<string>(
    'https://i.pinimg.com/736x/67/ac/89/67ac897b4b12c0d82a8c1c6d9c79287d.jpg',
  );
  readonly clientLogo = signal<string | null>(null);
    toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  toggleMenu(): void {
    this.isMenuOpen.update((state) => !state);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.notification.info("Cerrando sesión...")
    this.auth.logOut();
    this.router.navigate(['/login']);
    this.closeMenu();

  }

  goToProfile(): void {
    console.log('Ir a perfil');
    this.closeMenu();
  }

  goToSettings(): void {
    console.log('Ir a configuración');
    this.closeMenu();
  }

  getDisplayLogo(): string {
    return this.clientLogo() || this.appLogo();
  }
}
