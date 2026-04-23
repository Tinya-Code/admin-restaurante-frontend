import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { TenantService } from '../services/tenant.service';
import { filter, map, take } from 'rxjs/operators';

/**
 * Guard para rutas públicas (como login)
 * Redirige al home si ya está autenticado
 */
export const publicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const tenantService = inject(TenantService);

  return authState.state$.pipe(
    filter(authState => !authState.isLoading),
    take(1),
    map(authState => {
      if (authState.isAuthenticated) {
        console.log('✅ Ya autenticado - redirigiendo desde public');
        if (tenantService.activeRestaurantId()) {
          router.navigate(['/admin/home']);
        } else {
          router.navigate(['/auth/select-restaurant']);
        }
        return false;
      }

      return true;
    })
  );
};
