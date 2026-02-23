import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EndpointsService {
  private readonly baseUrl = environment.apiURL;

  // Auth endpoints
  login(): string {
    return `/auth/login`;
  }

  // Categories endpoints
  categories(): string {
    return `/categories`;
  }
  
  categoryById(categoryId: string): string {
    return `/categories/${categoryId}`;
  }

  // Products endpoints
  products(): string {
    return `/products`;
  }
  
  productById(productId: string): string {
    return `/products/${productId}`;
  }

  // Users endpoints
  userById(userId: string): string {
    return `${this.baseUrl}/users/${userId}`;
  }

  // Statistics endpoints
  statistics(): string {
    return `/statistics`;
  }
  
  productsCount(): string {
    return `${this.statistics()}/products/count`;
  }
  
  categoriesCount(): string {
    return `${this.statistics()}/categories/count`;
  }
  
  recentProducts(): string {
    return `${this.statistics()}/products/recent`;
  }
}