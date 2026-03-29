import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
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
    menu_id?: string;
  }): Observable<ApiResponse<CategoryList>> {
    return this.api.get<CategoryList>(this.endpoints.categories(), {
      params,
    }).pipe(
      map(response => {
        if (response.meta) {
          const anyMeta = response.meta as any;
          response.meta = {
            limit: anyMeta.itemsPerPage ?? anyMeta.limit ?? 10,
            current_page: anyMeta.currentPage ?? anyMeta.current_page ?? 1,
            total_pages: anyMeta.totalPages ?? anyMeta.total_pages ?? 1,
            total_items: anyMeta.totalItems ?? anyMeta.total_items ?? 0,
            has_next: (anyMeta.currentPage ?? anyMeta.current_page ?? 1) < (anyMeta.totalPages ?? anyMeta.total_pages ?? 1),
            has_prev: (anyMeta.currentPage ?? anyMeta.current_page ?? 1) > 1,
            order_by: anyMeta.sortBy ?? anyMeta.order_by,
          };
        }
        return response;
      })
    );
  }

  getCategoryById(categoryId: string): Observable<ApiResponse<Category>> {
    return this.api.get<Category>(this.endpoints.categoryById(categoryId));
  }

  createCategory(data: CategoryCreate): Observable<ApiResponse<Category>> {
    return this.api.post<Category>(this.endpoints.categories(), data);
  }

  updateCategory(categoryId: string, data: CategoryUpdate): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), data);
  }

  deleteCategory(categoryId: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(this.endpoints.categoryById(categoryId));
  }

  updateCategoryStatus(categoryId: string, is_active: boolean): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), { is_active });
  }
}

