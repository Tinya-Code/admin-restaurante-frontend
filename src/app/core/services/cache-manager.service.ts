import { Injectable, inject } from '@angular/core';
import { ProductService } from '../../features/admin/products/services/product.service';
import { CategoryService } from '../../features/admin/categories/services/category.service';
import { SearchService } from './search.service';
import { DashboardService } from '../../features/admin/dashboard/services/dashboard.service';
import { SettingsService } from '../../features/admin/settings/services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class CacheManagerService {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly searchService = inject(SearchService);
  private readonly dashboardService = inject(DashboardService);
  private readonly settingsService = inject(SettingsService);

  /**
   * Clears all application caches.
   * Useful on logout or when manual refresh is needed.
   */
  clearAll(): void {
    this.productService.clearCache();
    this.categoryService.clearCache();
    this.searchService.clearCache();
    this.dashboardService.clearCache();
    this.settingsService.clearSettingsCache();
  }
}
