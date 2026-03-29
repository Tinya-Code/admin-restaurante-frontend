import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { filter, map, take } from 'rxjs/operators';

/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  return authService.authState$.pipe(
    filter(authState => !authState.isLoading),
    take(1),
    map(authState => {
      if (authState.isAuthenticated) {
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
