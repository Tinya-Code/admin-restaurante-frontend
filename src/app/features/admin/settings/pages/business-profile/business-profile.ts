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
  Type,
  Settings
} from 'lucide-angular';
import { Subject, takeUntil, startWith } from 'rxjs';

import { NotificationService } from '../../../../../core/services/notification.service';
import { BusinessConfigComponent } from '../../components/business-config/business-config';
import { OrderConfigComponent } from '../../components/order-config/order-config';
import { WhatsAppConfigComponent } from '../../components/whatsapp-config/whatsapp-config';
import { BusinessSettings } from '../../../../../core/models/settings.models';
import { SettingsService } from '../../services/settings.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule
  ],
  templateUrl: './business-profile.html'
})
export class BusinessProfilePage implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  private destroy$ = new Subject<void>();

  readonly Building = Building;
  readonly ImageIcon = ImageIcon;
  readonly TypeIcon = Type;
  readonly SettingsIcon = Settings;

  restaurantData = signal<BusinessSettings | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSettings(): void {
    this.loading.set(true);
    this.settingsService.getRestaurantSettings().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.restaurantData.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
