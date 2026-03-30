import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Product as ProductI,
  ProductCreate,
  ProductUpdate,
} from '../../../../core/models/product.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { SearchService } from '../../../../core/services/search.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);
  private readonly searchService = inject(SearchService);

  // Cache state
  private readonly _cache = signal<ApiResponse<ProductI[]> | null>(null);
  private readonly _lastParams = signal<string>('');

  public readonly cache = this._cache.asReadonly();

  checkCache(params?: any): boolean {
    const paramString = JSON.stringify(params || {});
    return !!this._cache() && this._lastParams() === paramString;
  }

  getProducts(params?: {
    page?: number;
    limit?: number;
    category_id?: string;
    is_available?: boolean;
    min_price?: number;
    max_price?: number;
    search?: string;
  }): Observable<ApiResponse<ProductI[]>> {
    const paramString = JSON.stringify(params || {});
    
    // Return cache if it exists and params are identical
    if (this._cache() && this._lastParams() === paramString) {
      return of(this._cache()!);
    }

    const finalParams: any = {
      page: params?.page,
      limit: params?.limit,
    };

    if (params?.category_id) finalParams.category_id = params.category_id;
    if (params?.search) finalParams.search = params.search;
    if (params?.is_available !== undefined) finalParams.is_available = params.is_available;
    if (params?.min_price !== undefined) finalParams.min_price = params.min_price;
    if (params?.max_price !== undefined) finalParams.max_price = params.max_price;

    return this.api.get<ProductI[]>(this.endpoints.products(), { params: finalParams }).pipe(
      map((response) => {
        if (response.meta) {
          const anyMeta = response.meta as any;
          response.meta = {
            limit: anyMeta.itemsPerPage ?? anyMeta.limit ?? 10,
            current_page: anyMeta.currentPage ?? anyMeta.current_page ?? 1,
            total_pages: anyMeta.totalPages ?? anyMeta.total_pages ?? 1,
            total_items: anyMeta.totalItems ?? anyMeta.total_items ?? 0,
            has_next: (anyMeta.currentPage ?? anyMeta.current_page ?? 1) < (anyMeta.totalPages ?? anyMeta.total_pages ?? 1),
            has_prev: (anyMeta.currentPage ?? anyMeta.current_page ?? 1) > 1,
          };
        }
        return response;
      }),
      tap((response) => {
        this._cache.set(response);
        this._lastParams.set(paramString);
      })
    );
  }

  clearCache(): void {
    this._cache.set(null);
    this._lastParams.set('');
    this.searchService.clearCache();
  }

  getProductById(id: string): Observable<ApiResponse<ProductI>> {
    return this.api.get<ProductI>(this.endpoints.productById(id));
  }

  createProduct(data: ProductCreate, _image?: File): Observable<ApiResponse<ProductI>> {
    return this.api.post<ProductI>(this.endpoints.products(), data).pipe(
      tap(() => this.clearCache())
    );
  }

  updateProduct(id: string, data: ProductUpdate, _image?: File): Observable<ApiResponse<ProductI>> {
    return this.api.patch<ProductI>(this.endpoints.productById(id), data).pipe(
      tap(() => this.clearCache())
    );
  }

  patchProduct(id: string, data: Partial<ProductI>, _image?: File): Observable<ApiResponse<ProductI>> {
    return this.api.patch<ProductI>(this.endpoints.productById(id), data).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.endpoints.productById(id)).pipe(
      tap(() => this.clearCache())
    );
  }

  disableProduct(id: string): Observable<ApiResponse<ProductI>> {
    return this.api.patch<ProductI>(this.endpoints.productDisable(id), {}).pipe(
      tap(() => this.clearCache())
    );
  }

  reorderProducts(updates: { id: string; display_order: number }[]): Observable<ApiResponse<void>> {
    return this.api.patch<void>(this.endpoints.productReorderBulk(), { updates }).pipe(
      tap(() => this.clearCache())
    );
  }
}
