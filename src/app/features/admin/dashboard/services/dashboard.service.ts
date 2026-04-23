import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { Api } from '../../../../core/http/api';
import { ApiResponse } from '../../../../core/models/api-response.model';
import {
  CategoriesCountData,
  CombosCountData,
  DashboardStats,
  ProductsCountData,
  RecentProductItem,
  RecentProductsData,
  VisitsOverviewData,
} from '../../../../core/models/statistics.model';

export type { DashboardStats };

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  private readonly _dashboardStats = signal<DashboardStats | null>(null);
  private readonly _lastFetchTime = signal<number>(0);

  public readonly dashboardStats = this._dashboardStats.asReadonly();

  /** Returns true when cached data is still fresh (TTL: 5 min) */
  checkCache(): boolean {
    const CACHE_DURATION = 5 * 60 * 1000;
    return !!this._dashboardStats() && (Date.now() - this._lastFetchTime() < CACHE_DURATION);
  }

  // ── Individual endpoints ────────────────────────────────────────────────

  getProductsCount(): Observable<number> {
    return this.api
      .get<ProductsCountData>(this.endpoints.productsCount())
      .pipe(
        map((res: ApiResponse<ProductsCountData>) => {
          if (res.success && res.data) return res.data.total_products;
          throw new Error(res.message || 'Error al obtener conteo de productos');
        })
      );
  }

  getCategoriesCount(): Observable<number> {
    return this.api
      .get<CategoriesCountData>(this.endpoints.categoriesCount())
      .pipe(
        map((res: ApiResponse<CategoriesCountData>) => {
          if (res.success && res.data) return res.data.total_categories;
          throw new Error(res.message || 'Error al obtener conteo de categorías');
        })
      );
  }

  getCombosCount(): Observable<number> {
    return this.api
      .get<CombosCountData>(this.endpoints.combosCount())
      .pipe(
        map((res: ApiResponse<CombosCountData>) => {
          if (res.success && res.data) return res.data.total_combos;
          throw new Error(res.message || 'Error al obtener conteo de combos');
        })
      );
  }

  getRecentProducts(limit: number = 5): Observable<RecentProductItem[]> {
    return this.api
      .get<RecentProductsData>(this.endpoints.recentProducts(), { params: { limit } })
      .pipe(
        map((res: ApiResponse<RecentProductsData>) => {
          if (res.success && res.data) {
            // Backend may return data as array or as { products: [] }
            if (Array.isArray(res.data)) return res.data as unknown as RecentProductItem[];
            return (res.data as RecentProductsData).products ?? [];
          }
          throw new Error(res.message || 'Error al obtener productos recientes');
        })
      );
  }

  getVisitsOverview(): Observable<VisitsOverviewData | null> {
    return this.api
      .get<VisitsOverviewData>(this.endpoints.visitsOverview())
      .pipe(
        map((res: ApiResponse<VisitsOverviewData>) => {
          if (res.success && res.data) return res.data;
          return null;
        })
      );
  }

  // ── Aggregated call ─────────────────────────────────────────────────────

  getDashboardStats(): Observable<DashboardStats> {
    if (this.checkCache()) return of(this._dashboardStats()!);

    const now = Date.now();

    return forkJoin({
      totalProducts:   this.getProductsCount(),
      totalCategories: this.getCategoriesCount(),
      totalCombos:     this.getCombosCount(),
      recentProducts:  this.getRecentProducts(),
      visitsOverview:  this.getVisitsOverview(),
    }).pipe(
      tap(stats => {
        this._dashboardStats.set(stats);
        this._lastFetchTime.set(now);
      })
    );
  }

  clearCache(): void {
    this._dashboardStats.set(null);
    this._lastFetchTime.set(0);
  }
}
