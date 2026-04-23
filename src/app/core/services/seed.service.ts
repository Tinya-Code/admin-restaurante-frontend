import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from '../../features/admin/categories/services/category.service';
import { ProductService } from '../../features/admin/products/services/product.service';
import { NotificationService } from './notification.service';

// JSON imports (requires resolveJsonModule: true in tsconfig)
import categoriesData from '../../data/categories.json';
import productsData from '../../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class SeedService {
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);

  private readonly categories = categoriesData;
  private readonly products = productsData;

  /**
   * Ejecuta el proceso de seeding de manera secuencial 
   * Primero categorías, luego productos relacionados
   */
  async seedInitialData(): Promise<void> {
    const categoryNameMap = new Map<string, string>();

    try {
      // 1. Crear Categorías
      for (const cat of this.categories) {
        const payload = {
          name: cat.name,
          description: cat.description,
          is_active: cat.is_active,
          display_order: cat.display_order
        };
        
        const response = await lastValueFrom(this.categoryService.createCategory(payload));
        if (response.success && response.data) {
          categoryNameMap.set(cat.name, response.data.id);
        }
      }

      // 2. Crear Productos
      for (const prod of this.products) {
        const catId = categoryNameMap.get(prod.category_name);
        
        if (!catId) {
          console.warn(`No se encontró ID para la categoría: ${prod.category_name}`);
          continue;
        }

        const payload = {
          category_id: catId,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          is_available: prod.is_available,
          is_recommended: false
        };

        await lastValueFrom(this.productService.createProduct(payload));
      }

      this.notification.success('Datos iniciales creados correctamente');
    } catch (error) {
      console.error('Error during seeding:', error);
      this.notification.error('Error al crear los datos iniciales. Revisa la consola.');
      throw error;
    }
  }
}
