import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';
import { AuthStateService, AuthUser } from './auth-state.service';
import { TenantService, RestaurantMembership } from './tenant.service';
import { EndpointsService } from '../constants/endpoints';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private authState = inject(AuthStateService);
  private tenantService = inject(TenantService);
  private endpoints = inject(EndpointsService);

  private readonly API_URL = environment.apiURL;

  public authState$ = this.authState.state$;

  constructor() {
    // La inicialización real ocurre vía initAuth() llamado por APP_INITIALIZER
    // pero mantenemos el listener aquí por seguridad en caso de inyecciones tardías
  }

  /**
   * Inicializa el listener de autenticación. 
   * Retorna una promesa que se resuelve cuando el estado inicial es conocido.
   */
  public initAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (firebaseUser) => {
        if (firebaseUser) {
          // 🔥 IMPORTANTE: Seteamos el firebaseUser de inmediato para que los interceptores
          // tengan acceso al token durante la validación inicial
          this.authState.setAuthState({ firebaseUser });
          
          try {
            await this.refreshSession(firebaseUser);
          } catch (error) {
            console.error('❌ Error refreshing session:', error);
            this.authState.setAuthState({ isLoading: false });
          }
        } else {
          this.authState.clearState();
        }
        resolve();
      });
    });
  }

  /**
   * Refresca la sesión actual validando con el backend y cargando membresías
   */
  private async refreshSession(firebaseUser: FirebaseUser): Promise<void> {
    try {
      // 1. Validar Usuario con Backend
      const backendUser = await this.validateWithBackend();

      // 2. Cargar Membresías
      const memberships = await this.fetchMemberships();
      this.tenantService.setMemberships(memberships);

      // 3. Validar Restaurante Activo
      this.validateActiveRestaurant(memberships);

      // 4. Actualizar Estado Global y Desbloquear Guards
      this.authState.setAuthState({
        user: backendUser,
        isAuthenticated: true,
        isLoading: false,
      });

    } catch (error: any) {
      console.error('❌ Backend session refresh failed:', error);
      if (error.status === 401 || error.status === 403) {
        await this.closeSession();
      } else {
        this.authState.setAuthState({
          user: null,
          firebaseUser,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  }

  private validateActiveRestaurant(memberships: RestaurantMembership[]): void {
    const currentRestId = this.tenantService.activeRestaurantId();
    const currentBranchId = this.tenantService.activeBranchId();
    
    const isValid = memberships.some(
      m => m.restaurantId === currentRestId && m.branchId === currentBranchId
    );

    if (!isValid && memberships.length > 0) {
      if (memberships.length === 1) {
        this.tenantService.setActiveContext(memberships[0].restaurantId, memberships[0].branchId);
      } else {
        this.tenantService.setActiveContext(null, null);
      }
    } else if (memberships.length === 0) {
      this.tenantService.setActiveContext(null, null);
    }
  }

  /**
   * Inicia sesión con Google
   */
  async loginWithGoogle(): Promise<void> {
    try {
      this.authState.setAuthState({ isLoading: true });

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(this.auth, provider);
      await this.refreshSession(result.user);

      this.notification.success(`¡Bienvenido!`);
      await this.handlePostLoginRedirect();

    } catch (error: any) {
      this.authState.setAuthState({ isLoading: false });
      if (error.code === 'auth/popup-closed-by-user') {
        this.notification.info('Inicio de sesión cancelado');
      } else {
        this.notification.error('Error al iniciar sesión');
      }
      throw error;
    }
  }

  private async handlePostLoginRedirect(): Promise<void> {
    const memberships = this.tenantService.memberships();
    console.log('🚀 Redirecting after login. Memberships:', memberships.length);
    
    if (memberships.length === 0) {
      this.notification.warning('No tienes restaurantes asociados.');
      this.router.navigate(['/login']);
      return;
    }

    if (memberships.length === 1) {
      const { restaurantId, branchId } = memberships[0];
      this.tenantService.setActiveContext(restaurantId, branchId);
      console.log('✅ Auto-seleccionando único contexto:', restaurantId, branchId);
      this.router.navigate(['/admin/home']);
    } else {
      const activeId = this.tenantService.activeRestaurantId();
      const activeBranchId = this.tenantService.activeBranchId();
      
      const hasValidContext = memberships.some(
        m => m.restaurantId === activeId && m.branchId === activeBranchId
      );

      if (hasValidContext) {
        this.router.navigate(['/admin/home']);
      } else {
        this.router.navigate(['/auth/select-restaurant']);
      }
    }
  }

  async closeSession(): Promise<void> {
    try {
      await signOut(this.auth);
      this.tenantService.clearTenant();
      this.authState.clearState();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error closing session:', error);
    }
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser || this.authState.currentState.firebaseUser;
    if (!user) {
      console.warn('⚠️ No user available for getIdToken');
      return null;
    }
    return await user.getIdToken();
  }

  private async validateWithBackend(): Promise<AuthUser> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<AuthUser>>(`${this.API_URL}${this.endpoints.login()}`)
    );
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Login failed');
    }
    return res.data;
  }

  public async fetchMemberships(): Promise<RestaurantMembership[]> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<RestaurantMembership[]>>(`${this.API_URL}${this.endpoints.memberships()}`)
      );
      
      console.log('📥 Respuesta de membresías:', res);

      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }

      return [];
    } catch (error: any) {
      console.error('❌ Error fetching memberships:', error.status, error.message);
      return [];
    }
  }

  get currentUser() { return this.authState.currentUser; }
  get isAuthenticated() { return this.authState.isAuthenticated; }
  get isLoading() { return this.authState.isLoading; }
}
