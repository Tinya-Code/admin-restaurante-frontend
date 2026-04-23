import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Database, Loader2, LucideAngularModule } from 'lucide-angular';
import { SeedService } from '../../../core/services/seed.service';

@Component({
  selector: 'app-initial-data-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      class="flex w-full justify-center items-center md:gap-3 gap-2 md:px-6 px-4 py-3 rounded-full font-medium text-sm border-2 cursor-pointer transition-all duration-200 font-inherit bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600 focus:outline-2 focus:outline-amber-500 focus:outline-offset-2  shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
      (click)="onSeedData()"
      [disabled]="loading()"
      aria-label="Cargar datos iniciales"
    >
      <lucide-icon 
        [img]="loading() ? Loader2Icon : DatabaseIcon" 
        [class]="loading() ? 'w-5 h-5 animate-spin' : 'w-5 h-5'"
      />
      <span class="whitespace-nowrap">
        {{ loading() ? 'Cargando...' : 'Datos Iniciales' }}
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class InitialDataButton {
  private readonly seedService = inject(SeedService);
  
  readonly loading = signal(false);
  
  readonly DatabaseIcon = Database;
  readonly Loader2Icon = Loader2;

  async onSeedData(): Promise<void> {
    if (this.loading()) return;

    if (!confirm('¿Seguro que quieres cargar datos de prueba? Esto los agregará a tu cuenta actual.')) {
        return;
    }

    this.loading.set(true);
    try {
      await this.seedService.seedInitialData();
    } catch (error) {
      console.error('Error in onSeedData:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
