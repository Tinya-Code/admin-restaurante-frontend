import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, throwError, of, tap } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { BusinessSettings, BranchSettings } from '../../../../core/models/settings.models';
import { NotificationService } from '../../../../core/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);
  private readonly notification = inject(NotificationService);

  private readonly _branchCache = signal<BranchSettings | null>(null);
  private readonly _lastFetchTime = signal<number>(0);

  checkCache(): boolean {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    return !!this._branchCache() && now - this._lastFetchTime() < CACHE_DURATION;
  }

  clearSettingsCache(): void {
    this._branchCache.set(null);
    this._lastFetchTime.set(0);
  }

  /**
   * Obtener configuración global del restaurante (Plan, información legal, etc.)
   */
  getRestaurantSettings(): Observable<ApiResponse<BusinessSettings>> {
    return this.api.get<BusinessSettings>(this.endpoints.restaurantSettings()).pipe(
      tap(res => {
        if (res.success) this.notification.success('Información general cargada');
      }),
      catchError(err => {
        this.notification.error('Error al cargar la información general');
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtener configuración completa de la sucursal activa
   */
  getBranchSettings(): Observable<ApiResponse<BranchSettings>> {
    return this.api.get<BranchSettings>(this.endpoints.branchSettings()).pipe(
      map((response) => {
        if (response.success && response.data) {
          response.data = this.mapBranchApiToUi(response.data);
          this._branchCache.set(response.data);
          this._lastFetchTime.set(Date.now());
        }
        return response;
      }),
      tap(res => {
        if (res.success) this.notification.success('Configuración de sucursal cargada');
      }),
      catchError(err => {
        this.notification.error('Error al cargar ajustes de sucursal');
        return throwError(() => err);
      })
    );
  }

  /**
   * Actualizar configuración de sucursal
   */
  updateBranchSettings(data: Partial<BranchSettings>): Observable<ApiResponse<BranchSettings>> {
    return this.api.put<BranchSettings>(this.endpoints.branchSettings(), data).pipe(
      map((response) => {
        if (response.success && response.data) {
          response.data = this.mapBranchApiToUi(response.data);
          this._branchCache.set(response.data);
        }
        return response;
      }),
      tap(res => {
        if (res.success) this.notification.success('Configuración guardada correctamente');
      }),
      catchError(err => {
        this.notification.error('Error al guardar ajustes de sucursal');
        return throwError(() => err);
      })
    );
  }

  /**
   * Mapear datos de la API de Branch al formato de la UI
   */
  private mapBranchApiToUi(data: BranchSettings): BranchSettings {
    const uiData = { ...data };
    
    // Asegurar que los objetos anidados existan para evitar errores en la UI
    if (!uiData.whatsapp_config) {
      uiData.whatsapp_config = {
        enabled: false,
        number: '',
        message_template: '',
        show_prices: true,
        auto_include_restaurant_name: true
      };
    }
    if (!uiData.order_config) {
      uiData.order_config = {
        enabled: false,
        max_order_quantity: 1,
        delivery_fee: 0,
        payment_methods: [],
        accepts_reservations: false,
        delivery_enabled: false,
        pickup_enabled: false
      };
    }
    if (!uiData.display_config) {
      uiData.display_config = {
        show_images: true,
        show_descriptions: true,
        show_categories: true,
        currency: 'PEN',
        currency_symbol: 'S/',
        theme: 'auto',
        colors: { primary: '#000000', secondary: '#ffffff' },
        language: 'es',
        show_availability_badge: true
      };
    }
    
    return uiData;
  }
}
