import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Product as ProductI,
  ProductCreate,
  ProductUpdate,
  ProductPatch,
} from '../../../../core/models/product.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  getProducts(params?: {
    page?: number;
    limit?: number;
    category_id?: string;
    is_available?: boolean;
    min_price?: number;
    max_price?: number;
    search?: string;
  }): Observable<ApiResponse<ProductI[]>> {
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
    );
  }

  getProductById(id: string): Observable<ApiResponse<ProductI>> {
    return this.api.get<ProductI>(this.endpoints.productById(id));
  }

  createProduct(data: ProductCreate, _image?: File): Observable<ApiResponse<ProductI>> {
    // TODO: La subida de imágenes ha sido temporalmente deshabilitada en el API
    return this.api.post<ProductI>(this.endpoints.products(), data);
  }

  updateProduct(id: string, data: ProductUpdate, _image?: File): Observable<ApiResponse<ProductI>> {
    // Parche parcial según documentación para no requerir toda la entidad
    return this.api.patch<ProductI>(this.endpoints.productById(id), data);
  }

  patchProduct(id: string, data: Partial<ProductI>, _image?: File): Observable<ApiResponse<ProductI>> {
    return this.api.patch<ProductI>(this.endpoints.productById(id), data);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.endpoints.productById(id));
  }

  disableProduct(id: string): Observable<ApiResponse<ProductI>> {
    return this.api.patch<ProductI>(this.endpoints.productDisable(id), {});
  }

  reorderProducts(updates: { id: string; display_order: number }[]): Observable<ApiResponse<void>> {
    return this.api.patch<void>(this.endpoints.productReorderBulk(), { updates });
  }
}
