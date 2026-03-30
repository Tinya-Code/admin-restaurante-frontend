import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { Api } from '../../../../core/http/api';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Product } from '../../../../core/models/product.model';
import { Category } from '../../../../core/models/category.model';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  recentProducts: Product[];
}

export interface ProductsCountResponse {
  total_products: number;
}

export interface CategoriesCountResponse {
  total_categories: number;
}

export interface RecentProductsResponse {
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  private readonly _dashboardStats = signal<DashboardStats | null>(null);
  private readonly _lastFetchTime = signal<number>(0);

  public readonly dashboardStats = this._dashboardStats.asReadonly();

  checkCache(): boolean {
    const CACHE_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    return !!this._dashboardStats() && (now - this._lastFetchTime() < CACHE_DURATION);
  }

  getProductsCount(): Observable<number> {
    return this.api
      .get<ProductsCountResponse>(this.endpoints.productsCount())
      .pipe(
        map((response: ApiResponse<ProductsCountResponse>) => {
          if (response.success && response.data) {
            return response.data.total_products;
          }
          throw new Error(response.message || 'Error al obtener conteo de productos');
        })
      );
  }

  getCategoriesCount(): Observable<number> {
    return this.api
      .get<CategoriesCountResponse>(this.endpoints.categoriesCount())
      .pipe(
        map((response: ApiResponse<CategoriesCountResponse>) => {
          if (response.success && response.data) {
            return response.data.total_categories;
          }
          throw new Error(response.message || 'Error al obtener conteo de categorías');
        })
      );
  }

  getRecentProducts(limit: number = 5): Observable<Product[]> {
    return this.api
      .get<any>(this.endpoints.recentProducts(), { params: { limit } })
      .pipe(
        map((response: ApiResponse<any>) => {
          if (response.success && response.data) {
            // Soportar tanto si el backend envía un Array directo o un objeto con un array "products"
            if (Array.isArray(response.data)) {
              return response.data;
            }
            return response.data.products || [];
          }
          throw new Error(response.message || 'Error al obtener productos recientes');
        })
      );
  }

  getDashboardStats(): Observable<DashboardStats> {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();

    if (this._dashboardStats() && (now - this._lastFetchTime() < CACHE_DURATION)) {
      return of(this._dashboardStats()!);
    }

    return forkJoin({
      totalProducts: this.getProductsCount(),
      totalCategories: this.getCategoriesCount(),
      recentProducts: this.getRecentProducts()
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
