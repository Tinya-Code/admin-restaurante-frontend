import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, forkJoin, of, tap, switchMap } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Banner } from '../../../../core/models/settings.models';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  // State Signals
  private _banners = signal<Banner[]>([]);
  private _initialBanners = signal<Banner[]>([]);

  // Public Accessors
  public readonly banners = this._banners.asReadonly();
  public readonly hasChanges = computed(() => {
    return JSON.stringify(this._banners()) !== JSON.stringify(this._initialBanners());
  });

  /**
   * Carga los banners desde la API y sincroniza el estado inicial.
   */
  loadBanners(): Observable<ApiResponse<Banner[]>> {
    return this.api.get<Banner[]>(this.endpoints.banners()).pipe(
      tap(res => {
        if (res.success && res.data) {
          const sorted = [...res.data].sort((a, b) => a.display_order - b.display_order);
          this._banners.set(sorted);
          this._initialBanners.set(sorted);
        }
      })
    );
  }

  // --- Manipulación Síncrona del Estado ---

  addBanner(base64: string): void {
    const newBanner: Banner = {
      id: `temp-${Date.now()}`,
      image_url: base64, 
      description: 'Nuevo Banner',
      display_order: this._banners().length,
      is_active: true
    };
    this._banners.update(list => [...list, newBanner]);
  }

  updateStatus(id: string, active: boolean): void {
    this._banners.update(list => 
      list.map(b => b.id === id ? { ...b, is_active: active } : b)
    );
  }

  removeBanner(id: string): void {
    this._banners.update(list => list.filter(b => b.id !== id));
  }

  reorder(ids: string[]): void {
    const reordered = ids.map((id, index) => {
      const banner = this._banners().find(b => b.id === id)!;
      return { ...banner, display_order: index };
    });
    this._banners.set(reordered);
  }

  // --- Sincronización con el Backend ---

  saveChanges(): Observable<any> {
    const current = this._banners();
    const initial = this._initialBanners();

    if (!this.hasChanges()) return of(true);

    const requests: Observable<any>[] = [];

    // 1. Eliminar banners
    const toDelete = initial.filter(i => !current.find(c => c.id === i.id));
    toDelete.forEach(b => requests.push(this.api.delete(this.endpoints.bannerById(b.id))));

    // 2. Crear nuevos banners
    const toCreate = current.filter(b => b.id.startsWith('temp-'));
    toCreate.forEach(b => {
      requests.push(this.api.post(this.endpoints.banners(), {
        image_base64: b.image_url,
        display_order: b.display_order,
        description: b.description
      }));
    });

    // 3. Actualizar estado de existentes
    const toUpdate = current.filter(c => {
      const init = initial.find(i => i.id === c.id);
      return init && init.is_active !== c.is_active;
    });
    toUpdate.forEach(b => {
      requests.push(this.api.patch(this.endpoints.bannerById(b.id), { is_active: b.is_active }));
    });

    // 4. Reordenar solo si no hay banners nuevos (para evitar IDs temporales)
    // Si hay banners nuevos, el display_order en el POST ya los posiciona.
    if (toCreate.length === 0) {
      const initialIds = initial.map(b => b.id).filter(id => !toDelete.find(d => d.id === id));
      const currentIds = current.map(b => b.id);
      
      if (JSON.stringify(initialIds) !== JSON.stringify(currentIds)) {
        requests.push(this.api.patch(this.endpoints.reorderBanners(), { bannerIds: currentIds }));
      }
    }

    if (requests.length === 0) return of(true);

    return forkJoin(requests).pipe(
      switchMap(() => this.loadBanners())
    );
  }

  cancelChanges(): void {
    this.loadBanners().subscribe();
  }
}
