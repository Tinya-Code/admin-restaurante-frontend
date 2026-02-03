import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Grid3x3, Home, LucideAngularModule, Settings, UtensilsCrossed } from 'lucide-angular';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  route: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  host: {
    '[class.mobile]': 'isMobile()',
    '[class.desktop]': '!isMobile()',
  },
})
export class Navbar {
  private readonly router = inject(Router);

  readonly activeItem = signal<string>('inicio');

  readonly navItems = signal<NavItem[]>([
    { id: 'inicio', label: 'Inicio', icon: Home, route: '/admin/home' },
    { id: 'carta', label: 'Carta', icon: UtensilsCrossed, route: '/admin/menu' },
    { id: 'categoria', label: 'Categoría', icon: Grid3x3, route: '/admin/categories' },
    { id: 'configuracion', label: 'Configuración', icon: Settings, route: '/admin/settings' },
  ]);

  readonly isMobile = input<boolean>(true);

  readonly navigationClick = output<string>();

  readonly activeItemData = computed(() =>
    this.navItems().find((item) => item.id === this.activeItem())
  );

  onItemClick(itemId: string): void {
    this.activeItem.set(itemId);
    const navItem = this.navItems().find((item) => item.id === itemId);
    if (navItem) {
      this.router.navigate([navItem.route]);
    }
    this.navigationClick.emit(itemId);
  }

  isActive(itemId: string): boolean {
    return this.activeItem() === itemId;
  }
}
