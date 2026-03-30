import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, throwError, of } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { BusinessSettings } from '../../../../core/models/settings.models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  private readonly _cache = signal<BusinessSettings | null>(null);
  private readonly _lastFetchTime = signal<number>(0);

  checkCache(): boolean {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    return !!this._cache() && now - this._lastFetchTime() < CACHE_DURATION;
  }

  clearSettingsCache(): void {
    this._cache.set(null);
    this._lastFetchTime.set(0);
  }

  /**
   * Obtener configuración actual
   */
  getBusinessSettings(): Observable<ApiResponse<BusinessSettings>> {
    if (this.checkCache()) {
      return of({
        success: true,
        status: 'success',
        data: this._cache()!,
        message: 'De caché',
      } as any);
    }
    return this.api.get<BusinessSettings>(this.endpoints.businessSettings()).pipe(
      map((response) => {
        if (response.success && response.data) {
          response.data = this.mapApiToUi(response.data);
          this._cache.set(response.data);
          this._lastFetchTime.set(Date.now());
        }
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching settings:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar configuración (Upsert / Partial Update)
   */
  updateBusinessSettings(
    data: Partial<BusinessSettings>
  ): Observable<ApiResponse<BusinessSettings>> {
    const apiPayload = this.mapUiToApi(data);

    // Si el payload está vacío (no hay nada que actualizar), devolvemos un observable exitoso "vacío"
    if (Object.keys(apiPayload).length === 0) {
      return this.getBusinessSettings();
    }

    return this.api
      .put<BusinessSettings>(this.endpoints.businessSettings(), apiPayload)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            response.data = this.mapApiToUi(response.data);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Error updating settings:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Mapear datos de la API al formato de la UI
   * Ahora la API usa 'number' en whatsapp_config, al igual que nuestro modelo UI.
   */
  private mapApiToUi(data: BusinessSettings): BusinessSettings {
    const uiData = { ...data };

    // Sanitización y valores por defecto si es necesario
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
        max_order_quantity: 10,
        delivery_fee: 0,
        payment_methods: [],
        accepts_reservations: false,
        delivery_enabled: false,
        pickup_enabled: false
      };
    }

    return uiData;
  }

  /**
   * Mapear datos de la UI al formato de la API
   * Implementamos una lógica de filtrado para enviar solo lo que cambió o lo que es necesario.
   */
  private mapUiToApi(data: Partial<BusinessSettings>): any {
    const apiData: any = {};

    // Mapear whatsapp_config
    if (data.whatsapp_config) {
      apiData.whatsapp_config = {
        enabled: data.whatsapp_config.enabled,
        number: data.whatsapp_config.number,
        message_template: data.whatsapp_config.message_template,
        show_prices: data.whatsapp_config.show_prices,
        greeting: data.whatsapp_config.greeting,
        auto_include_restaurant_name: data.whatsapp_config.auto_include_restaurant_name,
      };
      
      // Limpiar campos undefined
      Object.keys(apiData.whatsapp_config).forEach(key => {
        if (apiData.whatsapp_config[key] === undefined) {
          delete apiData.whatsapp_config[key];
        }
      });
    }

    // Mapear business_config
    if (data.business_config) {
      apiData.business_config = {
        business_hours: data.business_config.business_hours,
        timezone: data.business_config.timezone,
        delivery_zones: data.business_config.delivery_zones,
        social_media: data.business_config.social_media,
      };
    }

    // Mapear order_config
    if (data.order_config) {
      apiData.order_config = {
        enabled: data.order_config.enabled,
        max_order_quantity: data.order_config.max_order_quantity,
        delivery_fee: data.order_config.delivery_fee,
        payment_methods: data.order_config.payment_methods,
        accepts_reservations: data.order_config.accepts_reservations,
        delivery_enabled: data.order_config.delivery_enabled,
        pickup_enabled: data.order_config.pickup_enabled,
      };
      
      // Limpiar campos undefined
      Object.keys(apiData.order_config).forEach(key => {
        if (apiData.order_config[key] === undefined) {
          delete apiData.order_config[key];
        }
      });
    }

    // Mapear display_config
    if (data.display_config) {
      apiData.display_config = {
        show_images: data.display_config.show_images,
        show_descriptions: data.display_config.show_descriptions,
        show_categories: data.display_config.show_categories,
        currency: data.display_config.currency,
        currency_symbol: data.display_config.currency_symbol,
        theme: data.display_config.theme,
        colors: data.display_config.colors,
        language: data.display_config.language,
        show_availability_badge: data.display_config.show_availability_badge,
      };
    }

    return apiData;
  }
}
