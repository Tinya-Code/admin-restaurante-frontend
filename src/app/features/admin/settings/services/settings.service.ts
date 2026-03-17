import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { BusinessConfig, BusinessSettings, OrderConfig, WhatsAppConfig } from './settings.models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private api = inject(Api);

  // BehaviorSubject para manejar estado actual
  private currentSettingsSubject = new BehaviorSubject<BusinessSettings | null>(null);
  public currentSettings$ = this.currentSettingsSubject.asObservable();

  /**
   * Obtener configuración del negocio por ID
   * Usa endpoint existente: GET /business-settings/{id}
   */
  getBusinessSettings(id: string) {
    return this.api.get<BusinessSettings>(`/business-settings/${id}`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.currentSettingsSubject.next(response.data);
        }
      })
    );
  }

  /**
   * Actualizar configuración del negocio
   * Usa endpoint existente: UPDATE /business-settings/{id}
   */
  updateBusinessSettings(id: string, settings: Partial<BusinessSettings>) {
    return this.api
      .put<BusinessSettings>(`/business-settings/${id}`, {
        business_config: settings.business_config,
        whatsapp_config: settings.whatsapp_config,
        order_config: settings.order_config,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.currentSettingsSubject.next(response.data);
          }
        })
      );
  }

  /**
   * Actualizar solo configuración de WhatsApp
   */
  updateWhatsAppConfig(id: string, config: WhatsAppConfig) {
    return this.updateBusinessSettings(id, { whatsapp_config: config });
  }

  /**
   * Actualizar solo configuración de órdenes
   */
  updateOrderConfig(id: string, config: OrderConfig) {
    return this.updateBusinessSettings(id, { order_config: config });
  }

  /**
   * Actualizar solo configuración del negocio
   */
  updateBusinessConfig(id: string, config: BusinessConfig) {
    return this.updateBusinessSettings(id, { business_config: config });
  }

  /**
   * Obtener configuración actual del BehaviorSubject
   */
  getCurrentSettings(): BusinessSettings | null {
    return this.currentSettingsSubject.value;
  }

  /**
   * Limpiar caché de configuración
   */
  clearSettingsCache(): void {
    this.currentSettingsSubject.next(null);
  }

  /**
   * Validar número de WhatsApp (9 dígitos)
   */
  validateWhatsAppNumber(number: string): boolean {
    // Remover espacios y caracteres no numéricos
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length === 9 && /^[9]/.test(cleanNumber);
  }

  /**
   * Formatear número de WhatsApp
   */
  formatWhatsAppNumber(number: string): string {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.slice(0, 9);
  }

  /**
   * Validar mensaje de WhatsApp (longitud máxima)
   */
  validateWhatsAppMessage(message: string, maxLength: number = 100): boolean {
    return message.length <= maxLength;
  }

  /**
   * Validar cantidad máxima de platos
   */
  validateMaxOrderQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity >= 1;
  }

  /**
   * Validar fee de delivery
   */
  validateDeliveryFee(fee: number): boolean {
    return fee >= 0 && Number.isFinite(fee);
  }

  /**
   * Validar URL de redes sociales
   */
  validateSocialMediaUrl(url: string): boolean {
    if (!url) return true; // opcional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validar formato de hora (HH:MM)
   */
  validateTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Validar configuración de horarios
   */
  validateBusinessHours(businessHours: any): boolean {
    // Implementar validación más compleja si es necesario
    return true;
  }

  /**
   * Validar zonas de delivery
   */
  validateDeliveryZones(zones: Array<{ name: string; fee: number }>): boolean {
    return zones.every(
      (zone) => zone.name.trim().length > 0 && zone.fee >= 0 && Number.isFinite(zone.fee)
    );
  }
}
