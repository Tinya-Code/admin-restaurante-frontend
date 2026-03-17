import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  Building,
  ClipboardList,
  LucideAngularModule,
  MessageCircle,
  TriangleAlert,
} from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

import { BusinessConfig } from '../../components/business-config/business-config';
import { OrderConfig } from '../../components/order-config/order-config';
import { WhatsAppConfig } from '../../components/whatsapp-config/whatsapp-config';
import { BusinessSettings } from '../../services/settings.models';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-page',
  imports: [CommonModule, WhatsAppConfig, OrderConfig, BusinessConfig, LucideAngularModule],
  templateUrl: './settings-page.html',
})
export class SettingsPage implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  private destroy$ = new Subject<void>();

  readonly MessageCircle = MessageCircle;
  readonly ClipboardList = ClipboardList;
  readonly Building = Building;
  readonly AlertTriangle = TriangleAlert;

  // Signals for reactive state management
  currentSettings = signal<BusinessSettings | null>(null);
  loading = signal(false);
  saving = signal(false);
  hasUnsavedChanges = signal(false);
  activeTab = signal('whatsapp');

  // Tab validation signals
  tabValidation = signal({
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
    this.loading.set(true);
    const businessId =
      sessionStorage.getItem('businessId') || '803a50be-7740-4eaf-b399-2b1ad06f1406';

    this.settingsService
      .getBusinessSettings(businessId)
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
    if (settings) {
      this.currentSettings.set({
        ...settings,
        [section]: config,
      });
      this.hasUnsavedChanges.set(true);
    }
  }

  // Computed signals for derived state
  whatsappConfig = computed(() => {
    const settings = this.currentSettings();
    return (
      settings?.whatsapp_config || {
        number: '',
        message_template: '',
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
        delivery_enabled: false,
        pickup_enabled: false,
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

    const businessId =
      sessionStorage.getItem('businessId') || '803a50be-7740-4eaf-b399-2b1ad06f1406';
    const settings = this.currentSettings()!;

    this.settingsService
      .updateBusinessSettings(businessId, settings)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.currentSettings.set(response.data);
            this.hasUnsavedChanges.set(false);
            this.showSuccess('Configuración guardada');
          } else {
            this.showError('Error al guardar');
          }
          this.saving.set(false);
        },
        error: () => {
          this.showError('Error al guardar');
          this.saving.set(false);
        },
      });
  }

  cancelChanges(): void {
    if (this.hasUnsavedChanges()) {
      if (!confirm('¿Descartar cambios?')) {
        return;
      }
    }
    this.loadSettings();
    this.hasUnsavedChanges.set(false);
  }

  private isFormValid(): boolean {
    const validation = this.tabValidation();
    return Object.values(validation).every((v) => v);
  }

  private showSuccess(message: string): void {
    console.log(message);
  }

  private showError(message: string): void {
    console.error(message);
  }

  // Computed signals for template access
  isLoading = computed(() => this.loading());
  isSaving = computed(() => this.saving());
  hasChanges = computed(() => this.hasUnsavedChanges());
  canSave = computed(() => this.hasUnsavedChanges() && this.isFormValid() && !this.saving());
  canCancel = computed(() => this.hasUnsavedChanges() && !this.saving());
}
