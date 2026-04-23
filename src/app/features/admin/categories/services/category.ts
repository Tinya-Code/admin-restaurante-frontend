import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
  CategoryList,
} from '../../../../core/models/category.model';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private api = inject(Api);
  private endpoints = inject(EndpointsService);

  /**
   * Obtener lista de categorías con filtros y paginación
   */
  getCategories(params: {
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
  }): Observable<ApiResponse<CategoryList>> {
    return this.api.get<CategoryList>(this.endpoints.categories(), {
      params,
    });
  }

  getCategoryById(categoryId: string): Observable<ApiResponse<Category>> {
    return this.api.get<Category>(this.endpoints.categoryById(categoryId));
  }

  createCategory(data: CategoryCreate): Observable<ApiResponse<Category>> {
    return this.api.post<Category>(this.endpoints.categories(), data);
  }

  updateCategory(categoryId: string, data: CategoryUpdate): Observable<ApiResponse<Category>> {
    return this.api.put<Category>(this.endpoints.categoryById(categoryId), data);
  }

  patchCategory(categoryId: string, data: CategoryUpdate): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), data);
  }

  deleteCategory(categoryId: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(this.endpoints.categoryById(categoryId));
  }

  updateCategoryStatus(categoryId: string, is_active: boolean): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), { is_active });
  }
}

