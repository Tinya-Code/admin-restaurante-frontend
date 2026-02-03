import { RouterLink,Route } from '@angular/router';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogOut, User, Settings, ChevronDown } from 'lucide-angular';

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
  isOpen = false;
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  

readonly logOut = LogOut;
  readonly userIcon = User;
  readonly settings = Settings;
  readonly chevronDown = ChevronDown;
  // State
  readonly isMenuOpen = signal(false);
  readonly user = signal<UserProfile>({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'Administrador',
  });

  // Config
  readonly appLogo = signal<string>('https://i.pinimg.com/736x/67/ac/89/67ac897b4b12c0d82a8c1c6d9c79287d.jpg');
  readonly clientLogo = signal<string | null>(null); 

  toggleMenu(): void {
    this.isMenuOpen.update((state) => !state);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // Aquí iría la lógica de logout
    // this.authService.logout();
    //this.router.navigate(['/login']);
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

  getUserInitials(): string {
    const name = this.user().name;
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
