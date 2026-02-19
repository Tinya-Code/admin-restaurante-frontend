import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User 
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Notification } from '../../../core/services/notification';
import { environment } from '../../../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: Date;
}

export interface AuthState {
  user: AuthUser | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private notification = inject(Notification);
  private router = inject(Router);

  private readonly API_URL = environment.apiURL;

  // Estado de autenticación reactivo
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    firebaseUser: null,
    isAuthenticated: false,
    isLoading: true,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.initAuthStateListener();
  }

  /**
   * Escucha cambios en el estado de Firebase Auth
   */
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Validar con el backend
          const backendUser = await this.validateWithBackend();
          
          this.authStateSubject.next({
            user: backendUser,
            firebaseUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('❌ Backend validation failed:', error);
          // Si falla la validación del backend, cerrar sesión
          await this.closeSession();
        }
      } else {
        this.authStateSubject.next({
          user: null,
          firebaseUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
  }

  /**
   * Obtiene el token de Firebase del usuario actual
   */
  async getIdToken(): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (!user) return null;
      
      // forceRefresh: true para asegurar que el token sea válido
      return await user.getIdToken(true);
    } catch (error) {
      console.error('❌ Error getting Firebase token:', error);
      return null;
    }
  }

  /**
   * Valida el token de Firebase con el backend
   */
  private async validateWithBackend(): Promise<AuthUser> {
    const response = await firstValueFrom(
      this.http.get<AuthUser>(`${this.API_URL}/auth/login`)
    );
    return response;
  }

  /**
   * Inicia sesión con Google
   */
  async loginWithGoogle(): Promise<void> {
    try {
      this.authStateSubject.next({ 
        ...this.authStateSubject.value, 
        isLoading: true 
      });

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(this.auth, provider);
      const firebaseUser = result.user;

      // Validar con el backend
      const backendUser = await this.validateWithBackend();

      this.authStateSubject.next({
        user: backendUser,
        firebaseUser,
        isAuthenticated: true,
        isLoading: false,
      });

      this.notification.success(`¡Bienvenido ${backendUser.displayName || backendUser.email}!`);
      this.router.navigate(['/admin/home']);

    } catch (error: any) {
      this.authStateSubject.next({ 
        ...this.authStateSubject.value, 
        isLoading: false 
      });

      if (error.code === 'auth/popup-closed-by-user') {
        this.notification.info('Inicio de sesión cancelado');
      } else if (error.status === 401) {
        this.notification.error('Tu cuenta no está registrada. Contacta al administrador.');
        await signOut(this.auth);
      } else {
        this.notification.error(`Error al iniciar sesión: ${error.message || error}`);
      }
      
      throw error;
    }
  }

  /**
   * Cierra la sesión
   */
  async closeSession(): Promise<void> {
    try {
      await signOut(this.auth);
      
      this.authStateSubject.next({
        user: null,
        firebaseUser: null,
        isAuthenticated: false,
        isLoading: false,
      });

      this.notification.info('Sesión cerrada correctamente');
      this.router.navigate(['/login']);

    } catch (error) {
      console.error('❌ Error closing session:', error);
      this.notification.error(`Error al cerrar sesión: ${error}`);
    }
  }

  /**
   * Obtiene el usuario actual (sincrónico)
   */
  get currentUser(): AuthUser | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Verifica si el usuario está autenticado (sincrónico)
   */
  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Verifica si está cargando (sincrónico)
   */
  get isLoading(): boolean {
    return this.authStateSubject.value.isLoading;
  }
}