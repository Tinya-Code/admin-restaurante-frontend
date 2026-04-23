import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TenantService, RestaurantMembership } from '../../../../core/services/tenant.service';

import { RestaurantSelectorList } from '../../components/restaurant-selector-list/restaurant-selector-list';

@Component({
  selector: 'app-select-restaurant',
  standalone: true,
  imports: [RestaurantSelectorList],
  templateUrl: './select-restaurant.html'
})
export class SelectRestaurantPage implements OnInit {
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private router = inject(Router);

  memberships = signal<RestaurantMembership[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      // Si ya hay un restaurante seleccionado y es válido, redirigir directo
      const activeId = this.tenantService.activeRestaurantId();
      const activeBranchId = this.tenantService.activeBranchId();
      
      const data = await this.authService.fetchMemberships();
      this.memberships.set(data);

      if (data.length === 1) {
        console.log('✨ Única opción detectada, auto-seleccionando...');
        this.select(data[0]);
        return;
      }

      if (activeId && activeBranchId && data.some(m => m.restaurantId === activeId && m.branchId === activeBranchId)) {
        console.log('✨ Contexto ya seleccionado y válido, redirigiendo...');
        this.router.navigate(['/admin/home']);
        return;
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  select(membership: RestaurantMembership) {
    this.tenantService.setActiveContext(membership.restaurantId, membership.branchId);
    this.router.navigate(['/admin/home']);
  }

  async logout() {
    await this.authService.closeSession();
  }
}
