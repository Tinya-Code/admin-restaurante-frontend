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

  memberships(): string {
    return `/auth/memberships`;
  }

  // Menus endpoints
  menus(): string {
    return `/menus`;
  }

  menuById(menuId: string): string {
    return `/menus/${menuId}`;
  }

  // Categories endpoints
  categories(): string {
    return `/categories`;
  }
  
  categoryById(categoryId: string): string {
    return `/categories/${categoryId}`;
  }

  categoryTypes(): string {
    return `/category-types`;
  }

  // Products endpoints
  products(): string {
    return `/products`;
  }
  
  productById(productId: string): string {
    return `/products/${productId}`;
  }

  productDisable(productId: string): string {
    return `/products/${productId}/disable`;
  }

  // Combos endpoints
  combos(): string {
    return `/combos`;
  }

  comboById(comboId: string): string {
    return `/combos/${comboId}`;
  }

  // Promotions endpoints
  promotions(): string {
    return `/promotions`;
  }

  promotionById(promoId: string): string {
    return `/promotions/${promoId}`;
  }

  // Restaurant Tags endpoints
  restaurantTags(): string {
    return `/restaurant-tags`;
  }

  restaurantTagsCatalog(): string {
    return `/restaurant-tags/catalog`;
  }

  // Users endpoints
  userById(userId: string): string {
    return `/users/${userId}`;
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

  combosCount(): string {
    return `${this.statistics()}/combos/count`;
  }

  visitsOverview(): string {
    return `${this.statistics()}/visits/overview`;
  }

  // Search endpoint
  search(): string {
    return `/search`;
  }

  // Settings endpoints
  restaurantSettings(): string {
    return `/settings/restaurant`;
  }

  branchSettings(): string {
    return `/settings/branch`;
  }

  // Banners endpoints (Now a separate module /banners)
  banners(): string {
    return `/banners`;
  }

  bannerById(bannerId: string): string {
    return `/banners/${bannerId}`;
  }

  reorderBanners(): string {
    return `/banners/reorder`;
  }
}