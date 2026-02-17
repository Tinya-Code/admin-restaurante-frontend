import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EndpointsService {
  categories(): string {
    return `/categories`;
  }
  categoryById(categoryId: string): string {
    return `/categories/${categoryId}`;
  }
  products(): string {
    return `/products`;
  }
  productById(productId: string): string {
    return `/products/${productId}`;
  }
  userById(userId: string): string {
    return `/users/${userId}`;
  }
  loginEmail(): string {
    return `/auth/login`;
  }
  loginGoogle(): string {
    return `/auth/google`;
  }
  logout(): string {
    return `/auth/logout`;
  }
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
