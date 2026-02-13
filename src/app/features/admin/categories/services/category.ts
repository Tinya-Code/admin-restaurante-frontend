import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
  CategoryPatch,
  CategoryList,
} from '../../../../core/models/category.model';
import { Storage } from '../../../../core/services/storage';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private api = inject(Api);
  private endpoints = inject(EndpointsService);
  private storage = inject(Storage);

  /**
   * Obtener lista de categorías con filtros y paginación
   */
  getCategories(params: {
    menu_id?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
  }): Observable<ApiResponse<CategoryList>> {
    const restaurantId = this.storage.get<string>('restaurant_id');
    return this.api.get<CategoryList>(this.endpoints.categories(), {
      params: {
        restaurant_id: restaurantId ?? '',
        ...params,
      },
    });
  }

  getCategoryById(categoryId: string): Observable<ApiResponse<Category>> {
    return this.api.get<Category>(this.endpoints.categoryById(categoryId));
  }

  createCategory(data: CategoryCreate): Observable<ApiResponse<Category>> {
    const restaurantId = this.storage.get<string>('restaurant_id');
    return this.api.post<Category>(this.endpoints.categories(), {
      ...data,
      restaurant_id: restaurantId ?? '',
    });
  }

  updateCategory(categoryId: string, data: CategoryUpdate): Observable<ApiResponse<Category>> {
    return this.api.put<Category>(this.endpoints.categoryById(categoryId), data);
  }

  patchCategory(categoryId: string, data: CategoryPatch): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), data);
  }

  deleteCategory(categoryId: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(this.endpoints.categoryById(categoryId));
  }

  updateCategoryStatus(categoryId: string, is_active: boolean): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), { is_active });
  }
}

