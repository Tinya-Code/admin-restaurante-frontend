import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Product } from '../../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  
  private api = inject(Api);

  searchProducts(params: {
    category?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() ? `/search/products?${queryParams}` : '/search/products';
    
    return this.api.get<Product[]>(url);
  }

  searchCategories(): Observable<ApiResponse<any[]>> {
    return this.api.get<any[]>('/search/categories');
  }
}