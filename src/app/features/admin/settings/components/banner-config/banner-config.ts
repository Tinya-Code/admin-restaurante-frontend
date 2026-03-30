import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { LucideAngularModule, Image, Trash2, Plus, GripVertical, Power, AlertCircle } from 'lucide-angular';
import { BannerService } from '../../services/banner.service';
import { Banner } from '../../../../../core/models/settings.models';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-banner-config',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './banner-config.html',
})
export class BannerConfig implements OnInit {
  private bannerService = inject(BannerService);
  private notificationService = inject(NotificationService);

  banners = this.bannerService.banners;
  
  // Local state to satisfy UI but actual state is in service
  loading = signal(false);
  uploading = signal(false);

  configChange = output<void>();

  readonly ImageIcon = Image;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly GripIcon = GripVertical;
  readonly PowerIcon = Power;
  readonly AlertIcon = AlertCircle;

  ngOnInit(): void {
    if (this.banners().length === 0) {
      this.loadBanners();
    }
  }

  loadBanners(): void {
    this.loading.set(true);
    this.bannerService.loadBanners().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.notificationService.error('Error al cargar banners');
        this.loading.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    if (this.banners().length >= 2) {
      this.notificationService.error('Solo puedes configurar un máximo de 2 banners.');
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.notificationService.error('Por favor selecciona una imagen válida');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { 
        this.notificationService.error('La imagen no debe exceder los 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.bannerService.addBanner(reader.result as string);
        this.configChange.emit();
      };
      reader.readAsDataURL(file);
    }
  }

  toggleStatus(banner: Banner): void {
    this.bannerService.updateStatus(banner.id, !banner.is_active);
    this.configChange.emit();
  }

  deleteBanner(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return;
    this.bannerService.removeBanner(id);
    this.configChange.emit();
  }

  moveUp(index: number): void {
    if (index === 0) return;
    this.reorder(index, index - 1);
  }

  moveDown(index: number): void {
    if (index === this.banners().length - 1) return;
    this.reorder(index, index + 1);
  }

  private reorder(from: number, to: number): void {
    const list = [...this.banners()];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    
    const ids = list.map(b => b.id);
    this.bannerService.reorder(ids);
    this.configChange.emit();
  }
}
