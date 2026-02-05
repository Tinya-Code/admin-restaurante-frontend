import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Home,
  LucideAngularModule,
  Settings,
  UtensilsCrossed,
} from 'lucide-angular';

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
  private readonly location = inject(Location);

  readonly activeItem = signal<string>('');
  readonly isCollapsed = signal<boolean>(false);

  // Icon references for template
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  readonly navItems = signal<NavItem[]>([
    { id: 'inicio', label: 'Inicio', icon: Home, route: '/admin/home' },
    { id: 'carta', label: 'Carta', icon: UtensilsCrossed, route: '/admin/menu' },
    { id: 'categoria', label: 'Categoría', icon: Grid3x3, route: '/admin/categories' },
    { id: 'configuracion', label: 'Configuración', icon: Settings, route: '/admin/settings' },
  ]);

  readonly isMobile = input<boolean>(true);

  readonly navigationClick = output<string>();

  readonly activeItemData = computed(() => {
    const currentPath = this.location.path();
    const activeNav = this.navItems().find(
      (item) => currentPath.includes(item.route) || item.route.includes(currentPath)
    );
    return activeNav || this.navItems()[0]; // Fallback to first item
  });

  toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onItemClick(itemId: string): void {
    const navItem = this.navItems().find((item) => item.id === itemId);
    if (navItem) {
      this.router.navigate([navItem.route]);
    }
    this.navigationClick.emit(itemId);
  }

  isActive(itemId: string): boolean {
    const currentPath = this.location.path();
    const navItem = this.navItems().find((item) => item.id === itemId);
    if (!navItem) return false;

    return currentPath.includes(navItem.route) || navItem.route.includes(currentPath);
  }
}
