import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { ApiResponse } from '../../../../core/models/api-response.model';

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
  restaurantId = '5a53d32f-834d-43df-a9ed-5db9b6badef9';

  constructor(private api: Api) {}

  getProductsCount(): Observable<number> {
    return this.api
      .get<ProductsCountResponse>('statistics/products/count', {
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
      .get<CategoriesCountResponse>('statistics/categories/count', {
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
      .get<RecentProductsResponse>('statistics/products/recent', {
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
