// product.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product as ProductI, ProductCreate, ProductUpdate } from '../../../../core/models/product.model';
import { Api } from '../../../../core/http/api';
import { EndpointsService } from '../../../../core/constants/endpoints';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  getProducts(params?: { page?: number; limit?: number }): Observable<ApiResponse<ProductI[]>> {
    return this.api.get<ProductI[]>(this.endpoints.products(), { params });
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

  patchProduct(id: string, data: Partial<Product>, image?: File): Observable<ApiResponse<ProductI>> {
    const formData = this.buildFormData(data, image);
    return this.api.patch<ProductI>(this.endpoints.productById(id), formData);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(this.endpoints.productById(id));
  }

  private buildFormData(data: any, image?: File): FormData {
    const formData = new FormData();
    
    // Agregar datos como JSON string
    formData.append('data', JSON.stringify(data));
    
    // Agregar imagen si existe
    if (image) {
      formData.append('image', image, image.name);
    }
    
    return formData;
  }
}