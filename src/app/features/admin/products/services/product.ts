import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Product as ProductI,
  ProductCreate,
  ProductUpdate,
} from '../../../../core/models/product.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Storage } from '../../../../core/services/storage';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);
  private readonly storage = inject(Storage);

  getProducts(params?: {
    page?: number;
    limit?: number;
    category_id?: string;
    is_available?: boolean;
    min_price?: number;
    max_price?: number;
    search?: string;
  }): Observable<ApiResponse<ProductI[]>> {
    const restaurantId = this.storage.get<string>('restaurant_id');

    const finalParams: any = {
      page: params?.page,
      limit: params?.limit,
      restaurant_id: restaurantId,
    };

    if (params?.category_id) finalParams.category_id = params.category_id;
    if (params?.search) finalParams.search = params.search;

    return this.api.get<ProductI[]>(this.endpoints.products(), { params: finalParams });
  }

  getProductById(id: string): Observable<ApiResponse<ProductI>> {
    return this.api.get<ProductI>(this.endpoints.productById(id));
  }

  createProduct(data: ProductCreate, image?: File): Observable<ApiResponse<ProductI>> {
    const formData = this.buildFormData(data, image);
    return this.api.post<ProductI>(this.endpoints.products(), formData);
  }

  updateProduct(id: string, data: ProductUpdate, image?: File): Observable<ApiResponse<ProductI>> {
    const formData = this.buildFormData(data, image);
    return this.api.put<ProductI>(this.endpoints.productById(id), formData);
  }

  patchProduct(
    id: string,
    data: Partial<ProductI>,
    image?: File,
  ): Observable<ApiResponse<ProductI>> {
    const formData = this.buildFormData(data, image);
    return this.api.patch<ProductI>(this.endpoints.productById(id), formData);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.endpoints.productById(id));
  }

  private buildFormData(data: ProductCreate | ProductUpdate | Partial<ProductI>, image?: File): FormData {
    const formData = new FormData();

    // Añadir restaurant_id automáticamente
    const restaurantId = this.storage.get<string>('restaurant_id');
    if (restaurantId) {
      formData.append('restaurant_id', restaurantId);
    }

    // Campos del producto
    formData.append('category_id', data.category_id!);
    formData.append('name', data.name!);
    if (data.description) formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('is_available', String(data.is_available));

    // Imagen opcional
    if (image) {
      formData.append('image', image, image.name);
    }

    return formData;
  }
}
