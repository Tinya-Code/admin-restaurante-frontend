import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import {
  Category,
  CategoryCreate,
  CategoryUpdate,
  CategoryList,
} from '../../../../core/models/category.model';
import { SearchService } from '../../../../core/services/search.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);
  private readonly searchService = inject(SearchService);

  // Cache state
  private readonly _cache = signal<ApiResponse<CategoryList> | null>(null);
  private readonly _lastParams = signal<string>('');
  private readonly _activeCategories = signal<Category[] | null>(null);

  public readonly cache = this._cache.asReadonly();
  public readonly activeCategories = this._activeCategories.asReadonly();

  checkCache(params?: any): boolean {
    const paramString = JSON.stringify(params || {});
    return !!this._cache() && this._lastParams() === paramString;
  }

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
    // Specific optimization for "all active categories" dropdowns
    if (params.is_active === true && params.limit === 100 && this._activeCategories()) {
      return of({
        success: true,
        status: 'success',
        code: '200',
        data: this._activeCategories()!,
        message: 'Loaded from active categories cache',
      });
    }

    const paramString = JSON.stringify(params || {});
    // ...

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
      }),
      tap(response => {
        this._cache.set(response);
        this._lastParams.set(paramString);
        
        // Cache active categories specifically if that's what was requested
        if (params.is_active === true && params.limit === 100 && response.success) {
          this._activeCategories.set(response.data || []);
        }
      })
    );
  }

  clearCache(): void {
    this._cache.set(null);
    this._lastParams.set('');
    this._activeCategories.set(null);
    this.searchService.clearCache();
  }

  getCategoryById(categoryId: string): Observable<ApiResponse<Category>> {
    return this.api.get<Category>(this.endpoints.categoryById(categoryId));
  }

  createCategory(data: CategoryCreate): Observable<ApiResponse<Category>> {
    return this.api.post<Category>(this.endpoints.categories(), data).pipe(
      tap(() => this.clearCache())
    );
  }

  updateCategory(categoryId: string, data: CategoryUpdate): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), data).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteCategory(categoryId: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(this.endpoints.categoryById(categoryId)).pipe(
      tap(() => this.clearCache())
    );
  }

  updateCategoryStatus(categoryId: string, is_active: boolean): Observable<ApiResponse<Category>> {
    return this.api.patch<Category>(this.endpoints.categoryById(categoryId), { is_active }).pipe(
      tap(() => this.clearCache())
    );
  }
}

