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
 * Guard para rutas públicas (como login)
 * Redirige al home si ya está autenticado
 */
export const publicGuard: CanActivateFn = (
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
        console.log('✅ Ya autenticado - redirigiendo a home');
        router.navigate(['/admin/home']);
        return false;
      }

      return true;
    })
  );
};
