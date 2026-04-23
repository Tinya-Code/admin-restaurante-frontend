import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Building,
  ClipboardList,
  LucideAngularModule,
  MessageCircle,
  TriangleAlert,
  Image as ImageIcon,
  Clock,
  ArrowLeftRight,
  Settings
} from 'lucide-angular';
import { Subject, takeUntil, forkJoin, of, startWith } from 'rxjs';

import { NotificationService } from '../../../../../core/services/notification.service';
import { BannerService } from '../../services/banner.service';
import { BusinessConfigComponent } from '../../components/business-config/business-config';
import { OrderConfigComponent } from '../../components/order-config/order-config';
import { WhatsAppConfigComponent } from '../../components/whatsapp-config/whatsapp-config';
import { BusinessSettings, BranchSettings, DayHours, WhatsAppConfig, OrderConfig, BusinessConfig } from '../../../../../core/models/settings.models';
import { SettingsService } from '../../services/settings.service';
import { SettingsActionsComponent } from '../../components/settings-actions/settings-actions';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BannerConfigComponent } from '../../components/banner-config/banner-config';

@Component({
  selector: 'app-operational-settings',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    WhatsAppConfigComponent,
    OrderConfigComponent,
    BusinessConfigComponent,
    SettingsActionsComponent,
    ReactiveFormsModule,
    BannerConfigComponent
  ],
  templateUrl: './operational-settings.html'
})
export class OperationalSettingsPage implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  private bannerService = inject(BannerService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  readonly MessageCircle = MessageCircle;
  readonly ClipboardList = ClipboardList;
  readonly Building = Building;
  readonly ImageIcon = ImageIcon;
  readonly ClockIcon = Clock;
  readonly SettingsIcon = Settings;

  readonly tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'schedule', label: 'Horario', icon: Clock },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
  ] as const;

  initialSettings = signal<BranchSettings | null>(null);
  currentSettings = signal<BranchSettings | null>(null);
  loading = signal(false);
  saving = signal(false);
  activeTab = signal<'general' | 'schedule' | 'banners'>('general');
  
  branchForm = this.fb.group({
    description: [''],
    logo_url: ['']
  });

  // Reactive signal for form values
  branchFormValue = toSignal(this.branchForm.valueChanges.pipe(startWith(this.branchForm.value)));

  // Computed state for total current settings
  totalCurrentSettings = computed(() => {
    const settings = this.currentSettings();
    const formValue = this.branchFormValue();
    if (!settings) return null;
    return {
      ...settings,
      description: formValue?.description || '',
      logo_url: formValue?.logo_url || ''
    } as BranchSettings;
  });

  // Robust calculation of unsaved changes
  hasUnsavedChanges = computed(() => {
    const initial = this.initialSettings();
    const current = this.totalCurrentSettings();
    if (!initial || !current) return false;
    return !this.deepEqual(initial, current);
  });

  hasChanges = computed(() => this.hasUnsavedChanges() || this.bannerService.hasChanges());

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.loading.set(true);
    this.settingsService.clearSettingsCache();

    forkJoin({
      branch: this.settingsService.getBranchSettings(),
      banners: this.bannerService.loadBanners()
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.branch.success && res.branch.data) {
          const data = res.branch.data;
          this.initialSettings.set(JSON.parse(JSON.stringify(data)));
          this.currentSettings.set(JSON.parse(JSON.stringify(data)));
          this.branchForm.patchValue({
              description: data.description || '',
              logo_url: data.logo_url || ''
          }, { emitEvent: false });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  switchTab(tabId: 'general' | 'schedule' | 'banners'): void {
    this.activeTab.set(tabId);
  }

  // --- Change Handlers ---

  onConfigChange(section: keyof BranchSettings, value: any): void {
    const current = this.currentSettings();
    if (!current) return;
    this.currentSettings.set({ ...current, [section]: value });
  }

  onScheduleChange(schedule: DayHours): void {
    const current = this.currentSettings();
    if (!current) return;
    this.currentSettings.set({ ...current, schedule });
  }

  // --- Persistence ---

  saveSettings(): void {
    if (this.saving()) return;
    this.saving.set(true);
    
    const settingsToSend = this.totalCurrentSettings();
    if (!settingsToSend) return;

    const configSave$ = this.hasUnsavedChanges() 
      ? this.settingsService.updateBranchSettings(settingsToSend) 
      : of({ success: true, data: this.initialSettings() });
    
    const bannersSave$ = this.bannerService.hasChanges() 
      ? this.bannerService.saveChanges() 
      : of(null);

    forkJoin([configSave$, bannersSave$]).subscribe({
      next: ([configRes]) => {
        if (configRes && (configRes as any).success) {
            const updatedData = (configRes as any).data;
            this.initialSettings.set(JSON.parse(JSON.stringify(updatedData)));
            this.currentSettings.set(JSON.parse(JSON.stringify(updatedData)));
        }
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  cancelChanges(): void {
    const initial = this.initialSettings();
    if (confirm('¿Descartar cambios de la sucursal?')) {
        this.currentSettings.set(JSON.parse(JSON.stringify(initial || {})));
        if (initial) {
          this.branchForm.patchValue({
              description: initial.description || '',
              logo_url: initial.logo_url || ''
          }, { emitEvent: false });
        }
        
        if (this.bannerService.hasChanges()) this.bannerService.cancelChanges();
    }
  }

  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
    
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      let valA = a[key];
      let valB = b[key];
      
      if (typeof valA === 'object' && typeof valB === 'object') {
        if (!this.deepEqual(valA, valB)) return false;
      } else {
        const normalizedA = valA ?? '';
        const normalizedB = valB ?? '';
        if (normalizedA !== normalizedB) return false;
      }
    }
    return true;
  }
}
