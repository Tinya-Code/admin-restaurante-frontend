import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
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
  private api = inject(Api);
  private endpoints = inject(EndpointsService);

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
    return forkJoin({
      totalProducts: this.getProductsCount(),
      totalCategories: this.getCategoriesCount(),
      recentProducts: this.getRecentProducts()
    });
  }
}
