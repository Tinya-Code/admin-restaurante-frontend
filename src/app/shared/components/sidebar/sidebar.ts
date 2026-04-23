import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterModule, RouterLinkActive } from '@angular/router';
import {
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Home,
  Settings,
  UtensilsCrossed,
  LucideAngularModule,
  Building,
  ChevronDown,
} from 'lucide-angular';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly router = inject(Router);

  readonly activeIndex = signal<number>(0);
  readonly isCollapsed = signal(false);
  readonly isMobile = input<boolean>(false);
  readonly navigationClick = output<string>();

  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly ChevronDownIcon = ChevronDown;
  readonly UtensilsCrossed = UtensilsCrossed;

  readonly navItems = signal<NavItem[]>([
    { id: 'inicio', label: 'Inicio', icon: Home, route: '/admin/home' },
    {
      id: 'menu',
      label: 'Menú Digital',
      icon: UtensilsCrossed,
      children: [
        { id: 'productos', label: 'Productos', icon: UtensilsCrossed, route: '/admin/menu/products' },
        { id: 'categorias', label: 'Categorías', icon: Grid3x3, route: '/admin/menu/categories' },
      ]
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      children: [
        { id: 'business-profile', label: 'Perfil del Negocio', icon: Building, route: '/admin/settings/business-profile' },
        { id: 'operational', label: 'Ajustes de Sucursal', icon: Settings, route: '/admin/settings/operational' },
      ]
    },
  ]);

  readonly expandedItems = signal<Set<string>>(new Set());
  readonly mobileSubmenuOpen = signal<string | null>(null);

  // ✅ Nuevo método reactivo con signals
  readonly currentUrl = computed(() => this.router.url);

  readonly activeItemData = computed(() => {
    const path = this.currentUrl();
    return this.navItems().find((item) => item.route && path.startsWith(item.route)) ?? this.navItems()[0];
  });

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  onItemClick(item: NavItem): void {
    if (item.children) {
      if (this.isMobile()) {
        this.toggleMobileSubmenu(item.id);
      } else {
        this.toggleSubmenu(item.id);
      }
      return;
    }

    if (item.route) {
      this.router.navigateByUrl(item.route);
      this.navigationClick.emit(item.id);
      this.closeAllSubmenus();
    }
  }

  toggleSubmenu(id: string): void {
    const expanded = new Set(this.expandedItems());
    if (expanded.has(id)) {
      expanded.delete(id);
    } else {
      expanded.add(id);
    }
    this.expandedItems.set(expanded);
  }

  toggleMobileSubmenu(id: string): void {
    this.mobileSubmenuOpen.update(current => current === id ? null : id);
  }

  closeAllSubmenus(): void {
    this.mobileSubmenuOpen.set(null);
  }

  isSubmenuExpanded(id: string): boolean {
    return this.expandedItems().has(id);
  }

  isParentActive(item: NavItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.currentUrl().startsWith(child.route!));
  }
  setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }



}
