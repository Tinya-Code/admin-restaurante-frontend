import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private auth: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Solo agregar token a peticiones a nuestro backend
    if (this.requiresAuth(req.url)) {
      
      // Convertir Promise a Observable para manejar el token asíncrono
      return from(this.handleAuthRequest(req, next)).pipe(
        catchError((error) => this.handleError(error))
      );
    }
    
    // Si no requiere auth, dejar pasar la petición original
    return next.handle(req);
  }

  private async handleAuthRequest(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    try {
      // Obtener token de Firebase
      const token = await this.auth.getIdToken();
      
      // Obtener UID del usuario actual  ***(por ahora falso)***
      const currentUser = `uidPrueba`;
      const userUid = currentUser;
      
      let authReq = req;
      
      // Agregar headers si hay token
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            sopUuid: userUid  // *** Header personalizado con UID ***
          }
        });
        
        console.log('🔐 Interceptor: Token agregado a', req.url);
        console.log('👤 UID del usuario:', userUid);
      } else {
        console.log('⚠️ Interceptor: No hay token disponible');
      }
      
      // Ejecutar la petición
      return await firstValueFrom(next.handle(authReq));
      
    } catch (error) {
      console.error('❌ Interceptor: Error en auth', error);
      throw error;
    }
  }

  private requiresAuth(url: string): boolean {
    // Definir qué endpoints requieren autenticación
    const authRequiredEndpoints = ['/search', '/api/'];
    return authRequiredEndpoints.some(endpoint => url.includes(endpoint));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ HTTP Error:', error);
    
    // Manejar errores de autenticación
    if (error.status === 401) {
      console.warn('🔓 No autorizado - redirigir a login');
      // TODO: Redirigir a login o refresh token
    }
    
    return throwError(() => error);
  }
}
