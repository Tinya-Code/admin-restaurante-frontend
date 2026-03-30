import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  Building,
  ClipboardList,
  LucideAngularModule,
  MessageCircle,
  TriangleAlert,
} from 'lucide-angular';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';

import { NotificationService } from '../../../../../core/services/notification.service';
import { BannerService } from '../../services/banner.service';
import { BusinessConfig } from '../../components/business-config/business-config';
import { OrderConfig } from '../../components/order-config/order-config';
import { WhatsAppConfig } from '../../components/whatsapp-config/whatsapp-config';
import { BusinessSettings } from '../../../../../core/models/settings.models';
import { SettingsService } from '../../services/settings.service';
import { SettingsActions } from '../../components/settings-actions/settings-actions';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    WhatsAppConfig,
    OrderConfig,
    BusinessConfig,
    SettingsActions,
  ],
  templateUrl: './settings-page.html',
})
export class SettingsPage implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  private bannerService = inject(BannerService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  readonly MessageCircle = MessageCircle;
  readonly ClipboardList = ClipboardList;
  readonly Building = Building;
  readonly AlertTriangle = TriangleAlert;

  // Tab configuration for template
  readonly tabs = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'order', label: 'Órdenes', icon: ClipboardList },
    { id: 'business', label: 'Negocio', icon: Building },
  ];

  // Signals for reactive state management
  currentSettings = signal<BusinessSettings | null>(null);
  loading = signal(false);
  saving = signal(false);
  hasUnsavedChanges = signal(false);
  hasChanges = computed(() => this.hasUnsavedChanges() || this.bannerService.hasChanges());
  activeTab = signal('whatsapp');

  // Tab validation signals
  tabValidation = signal<{
    whatsapp: boolean;
    order: boolean;
    business: boolean;
    [key: string]: boolean;
  }>({
    whatsapp: false,
    order: false,
    business: false,
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSettings(): void {
    const isCached = this.settingsService.checkCache();
    if (!isCached) {
      this.loading.set(true);
    }

    this.settingsService
      .getBusinessSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.currentSettings.set(response.data);
          } else {
            this.showError('Error al cargar la configuración');
          }
          this.loading.set(false);
        },
        error: () => {
          this.showError('Error al cargar la configuración');
          this.loading.set(false);
        },
      });
  }

  switchTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  onTabValidation(tabId: string, isValid: boolean): void {
    this.tabValidation.update((current: any) => ({
      ...current,
      [tabId]: isValid,
    }));
  }

  onConfigChange(section: keyof BusinessSettings, config: any): void {
    const settings = this.currentSettings();
    if (!settings) return;
    const previous = settings[section];
    const isDifferent = !this.isEqual(previous, config);

    if (!isDifferent) return;
    this.currentSettings.set({
      ...settings,
      [section]: config,
    });
    this.hasUnsavedChanges.set(true);
  }

  // Computed signals for derived state
  whatsappConfig = computed(() => {
    const settings = this.currentSettings();
    return (
      settings?.whatsapp_config || {
        enabled: false,
        number: '',
        message_template: '',
        show_prices: true,
        greeting: '',
        auto_include_restaurant_name: true,
      }
    );
  });

  orderConfig = computed(() => {
    const settings = this.currentSettings();
    return (
      settings?.order_config || {
        enabled: false,
        max_order_quantity: 1,
        delivery_fee: 0,
        payment_methods: [],
        accepts_reservations: false,
        pickup_enabled: false,
        delivery_enabled: false,
      }
    );
  });

  businessConfig = computed(() => {
    const settings = this.currentSettings();
    return (
      settings?.business_config || {
        business_hours: {
          monday: { open: '09:00', close: '22:00', isOpen: false },
          tuesday: { open: '09:00', close: '22:00', isOpen: false },
          wednesday: { open: '09:00', close: '22:00', isOpen: false },
          thursday: { open: '09:00', close: '22:00', isOpen: false },
          friday: { open: '09:00', close: '23:00', isOpen: false },
          saturday: { open: '10:00', close: '23:00', isOpen: false },
          sunday: { open: '10:00', close: '20:00', isOpen: false },
        },
        timezone: 'America/Lima',
        delivery_zones: [],
        social_media: {
          facebook: '',
          instagram: '',
          tiktok: '',
        },
      }
    );
  });

  saveSettings(): void {
    if (!this.isFormValid()) {
      this.showError('Corrige los errores antes de guardar');
      return;
    }

    this.saving.set(true);
    
    // Preparar observables de guardado
    const settings = this.currentSettings();
    const configSave$ = settings && this.hasUnsavedChanges() 
      ? this.settingsService.updateBusinessSettings(settings) 
      : of(null);
    
    const bannersSave$ = this.bannerService.hasChanges() 
      ? this.bannerService.saveChanges() 
      : of(null);

    forkJoin([configSave$, bannersSave$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([configRes]) => {
          if (configRes && !configRes.success) {
            this.showError(configRes.message || 'Error al guardar configuración');
          } else {
            this.notificationService.success('Cambios guardados correctamente');
            if (configRes && configRes.data) {
              this.currentSettings.set(configRes.data);
            }
            this.hasUnsavedChanges.set(false);
          }
          this.saving.set(false);
        },
        error: () => {
          this.showError('Ocurrió un error al guardar los cambios');
          this.saving.set(false);
        },
      });
  }

  cancelChanges(): void {
    if (this.hasUnsavedChanges() || this.bannerService.hasChanges()) {
      if (!confirm('¿Descartar cambios?')) {
        return;
      }
    }
    this.loadSettings();
    this.hasUnsavedChanges.set(false);
    if (this.bannerService.hasChanges()) {
      this.bannerService.cancelChanges();
    }
  }

  onBannerChange(): void {
    // El computed hasChanges se actualizará automáticamente 
    // porque depende de bannerService.hasChanges()
  }

  // Computed signals for template access
  isLoading = computed(() => this.loading());
  isSaving = computed(() => this.saving());
  isCurrentTabValid = computed(() => {
    const tab = this.activeTab();
    return this.tabValidation()[tab];
  });
  canSave = computed(() => this.hasChanges() && this.isCurrentTabValid() && !this.saving());
  canCancel = computed(() => this.hasChanges() && !this.saving());

  private isFormValid(): boolean {
    const validation = this.tabValidation();
    return Object.values(validation).every((v) => v);
  }

  private showError(message: string): void {
    this.notificationService.error(message);
  }

  isEqual(a: any, b: any): boolean {
    return JSON.stringify(this.sortObject(a)) === JSON.stringify(this.sortObject(b));
  }

  sortObject(obj: any): any {
    if (Array.isArray(obj)) return obj.map(this.sortObject.bind(this));

    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = this.sortObject(obj[key]);
          return result;
        }, {});
    }

    return obj;
  }
}
