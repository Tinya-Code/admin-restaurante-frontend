import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { from } from 'rxjs';
import { AuthService } from '../../features/auth/services/authService';
import { environment } from '../../../environments/environment';

/**
 * Interceptor funcional para Angular 20
 * Agrega el token de Firebase a las peticiones al backend
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Solo agregar token a peticiones a nuestro backend
  if (!shouldAttachToken(req.url)) {
    return next(req).pipe(catchError(error => handleError(error, router, authService)));
  }

  // Obtener token y agregarlo a la petición
  return from(authService.getIdToken()).pipe(
    switchMap(token => {
      let authReq = req;

      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('🔐 Token agregado a:', req.url);
      } else {
        console.warn('⚠️ No hay token disponible para:', req.url);
      }

      return next(authReq);
    }),
    catchError(error => handleError(error, router, authService))
  );
};

/**
 * Determina si la URL requiere token
 */
function shouldAttachToken(url: string): boolean {
  // Solo agregar token a peticiones a nuestro backend
  if (!url.startsWith(environment.apiURL)) {
    return false;
  }

  // No agregar token al endpoint de login (ya que el guard lo maneja)
  if (url.includes('/auth/login')) {
    return true; // Sí necesita token para validar
  }

  return true;
}

/**
 * Maneja errores HTTP
 */
function handleError(
  error: HttpErrorResponse,
  router: Router,
  authService: AuthService
) {
  console.error('❌ HTTP Error:', {
    status: error.status,
    message: error.message,
    url: error.url
  });

  if (error.status === 401) {
    console.warn('🔓 No autorizado - cerrando sesión');
    authService.closeSession();
  }

  if (error.status === 403) {
    console.warn('🚫 Acceso prohibido');
  }

  return throwError(() => error);
}