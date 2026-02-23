import { HttpInterceptorFn, HttpEvent } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Solo agregar token a peticiones a nuestro backend
  if (requiresAuth(req.url)) {
    
    // Agregar token directamente
    const authReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer test-token-123'
      }
    });
    
    console.log('🔐 Interceptor: Token agregado a', req.url);
    console.log('📋 Headers enviados:', authReq.headers);
    
    return next(authReq).pipe(
      catchError((error) => handleError(error))
    );
  }
  
  // Si no requiere auth, dejar pasar la petición original
  console.log('⚡ Pasando sin auth:', req.url);
  return next(req);
};

function requiresAuth(url: string): boolean {
  // Definir qué endpoints requieren autenticación
  const authRequiredEndpoints = ['/search/products', '/api/'];
  return authRequiredEndpoints.some(endpoint => url.includes(endpoint));
}

function handleError(error: any): Observable<never> {
  console.error('❌ HTTP Error:', error);
  
  // Manejar errores de autenticación
  if (error.status === 401) {
    console.warn('🔓 No autorizado - redirigir a login');
    // TODO: Redirigir a login o refresh token
  }
  
  throw error;
}
