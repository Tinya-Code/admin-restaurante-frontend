import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { Api } from '../../../../core/http/api';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Storage } from '../../../../core/services/storage';
export interface Product {
  id: string;
  category_name: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  update_at: string;
}

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
  private storage = inject(Storage);

  private restaurantId: string = this.storage.get<string>('restaurant_id') || '';

  getProductsCount(): Observable<number> {
    return this.api
      .get<ProductsCountResponse>(this.endpoints.productsCount(), {
        params: { restaurant_id: this.restaurantId },
      })
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
      .get<CategoriesCountResponse>(this.endpoints.categoriesCount(), {
        params: { restaurant_id: this.restaurantId },
      })
      .pipe(
        map((response: ApiResponse<CategoriesCountResponse>) => {
          if (response.success && response.data) {
            return response.data.total_categories;
          }
          throw new Error(response.message || 'Error al obtener conteo de categorías');
        })
      );
  }

  getRecentProducts(): Observable<Product[]> {
    return this.api
      .get<RecentProductsResponse>(this.endpoints.recentProducts(), {
        params: { restaurant_id: this.restaurantId },
      })
      .pipe(
        map((response: ApiResponse<RecentProductsResponse>) => {
          if (response.success && response.data) {
            return response.data.products;
          }
          throw new Error(response.message || 'Error al obtener productos recientes');
        })
      );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.getProductsCount().pipe(
      switchMap((productsCount: number) => {
        return this.getCategoriesCount().pipe(
          switchMap((categoriesCount: number) => {
            return this.getRecentProducts().pipe(
              map((recentProducts: Product[]) => ({
                totalProducts: productsCount,
                totalCategories: categoriesCount,
                recentProducts,
              }))
            );
          })
        );
      })
    );
  }
}
