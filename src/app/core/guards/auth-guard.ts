import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { AuthService } from '../../features/auth/services/authService';
import { map, take } from 'rxjs/operators';

/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(authState => {
      // Si está cargando, esperamos
      if (authState.isLoading) {
        return false;
      }

      // Si está autenticado, permitir acceso
      if (authState.isAuthenticated) {
        return true;
      }

      // Si no está autenticado, redirigir al login
      console.warn('🔒 Acceso denegado - redirigiendo a login');
      
      // Guardar la URL intentada para redirigir después del login
      const returnUrl = state.url;
      
      router.navigate(['/login'], {
        queryParams: { returnUrl }
      });
      
      return false;
    })
  );
};

/**
 * Guard para rutas públicas (como login)
 * Redirige al home si ya está autenticado
 */
export const publicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(authState => {
      // Si está cargando, esperamos
      if (authState.isLoading) {
        return false;
      }

      // Si está autenticado, redirigir al home
      if (authState.isAuthenticated) {
        console.log('✅ Ya autenticado - redirigiendo a home');
        router.navigate(['/admin/home']);
        return false;
      }

      // Si no está autenticado, permitir acceso a la ruta pública
      return true;
    })
  );
};