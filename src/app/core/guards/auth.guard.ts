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
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (
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
        
        // Bloquear rutas de admin si no hay restaurante activo
        if (state.url.includes('/admin')) {
          if (!tenantService.activeRestaurantId()) {
            console.warn('🔒 Acceso denegado a admin - falta seleccionar restaurante');
            router.navigate(['/auth/select-restaurant']);
            return false;
          }
        }
        
        return true;
      }

      console.warn('🔒 Acceso denegado - redirigiendo a login');
      
      const returnUrl = state.url;
      router.navigate(['/login'], {
        queryParams: { returnUrl }
      });
      
      return false;
    })
  );
};
