import { Component, inject, signal } from '@angular/core';
import { DataTable, TableColumn, TableAction , PaginationMeta } 
  from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
import type { Product } from '../../../../../core/models/product.model';
import { CategoryList } from "../../components/category-list/category-list";
import { SearchBar } from "../../../../../shared/components/search-bar/search-bar";
import { Notification } from '../../../../../core/services/notification';
import { SearchService } from '../../services/search';
import { ApiResponse } from "../../../../../core/models/api-response.model";
import { Api } from "../../../../../core/http/api";
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Button } from '../../../../../shared/components/button/button';
@Component({
  selector: 'app-product-list-page',
  imports: [DataTable, CategoryList, SearchBar, Button],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {

  // ============================================================
  // ===================== INYECCIÓN DE SERVICIOS ============
  // ============================================================
  
  private notification = inject(Notification);
  private router = inject(Router);
  private searchService = inject(SearchService);

  // ============================================================
  // ===================== STATE (Signals) ======================
  // ============================================================

  // Controla estado de carga (para spinner o skeleton)
  readonly loading = signal(false);

  // Lista reactiva de productos
  readonly products = signal<Product[]>([]);

  // Metadata de paginación
  readonly meta = signal<PaginationMeta>({
    limit: 10,
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false,
  });

  // Filtros reactivos
  category = signal<string>('');
  searchWord = signal<string>('');
  
  // Paginación reactiva
  currentPage = signal<number>(1);
  currentLimit = signal<number>(10);


  // ============================================================
  // ===================== TABLE CONFIG =========================
  // ============================================================

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '120px', hideOnMobile: true },
    { key: 'name', label: 'Producto', width: '250px', mobileOrder: 1 },
    { key: 'category_name', label: 'Categoría', width: '150px', mobileOrder: 2 },
    { 
      key: 'price', 
      label: 'Precio', 
      width: '120px', 
      align: 'right',
      mobileOrder: 3,
      pipe: 'currency'
    },
    { 
      key: 'created_at', 
      label: 'Creado', 
      width: '150px',
      hideOnMobile: true,
      pipe: 'date'
    }
  ];

  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row) => this.editProduct(row),
    },
    {
      label: 'Ver detalles',
      icon: Eye,
      handler: (row) => this.viewProduct(row),
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
      handler: (row) => this.deleteProduct(row),
    },
  ];

  // ============================================================
  // ===================== LIFECYCLE ============================
  // ============================================================

  ngOnInit(): void {
    // Carga inicial con valores por defecto
    this.loadProducts(1, 10);
  }

  // ============================================================
  // ===================== EVENT HANDLERS =======================
  // ============================================================

  /**
   * Cambia la categoría seleccionada.
   * Si es la misma categoría, no hace nada.
   */
  onCategoryChange(category: string): void {
    if (this.category() === category) return;

    this.category.set(category);
    this.currentPage.set(1); // Resetear a primera página
    this.debounceController(); // dispara petición con debounce manual
  }

  /**
   * Cambia la palabra de búsqueda.
   * Actualiza signal y dispara búsqueda con debounce.
   */
  onSearchChange(searchWord: string): void {
    if (this.searchWord() === searchWord) return;

    this.searchWord.set(searchWord);
    this.currentPage.set(1); // Resetear a primera página
    this.debounceController(); // dispara petición con debounce manual
  }

  /**
   * Cambio de página desde DataTable
   */
  onPageChange(page: number): void {
    const currentMeta = this.meta();
    
    // Validaciones para evitar páginas inválidas
    if (page < 1) return;
    if (currentMeta.total_pages > 0 && page > currentMeta.total_pages) return;
    
    this.currentPage.set(page);
    this.loadProducts(this.currentPage(), this.currentLimit());
  }

  /**
   * Click en producto
   */
  onProductClick(product: any): void {
    console.log('Producto:', product);
  }

  /**
   * Toggle de estado (ej: activo/inactivo)
   */
  onToggleChange(event: { row: any; enabled: boolean }): void {
    console.log('Toggle:', event);
    // Aquí iría updateProductStatus(event.row.id, event.enabled)
  }

  // ============================================================
  // ================= CONTROL DE PETICIONES ====================
  // ======================= DEBOUNCE ===========================

  private peticionOut: any;
  private debounceController(): void {
    // Si hay una petición pendiente, la cancelamos
    if (this.peticionOut) {
      clearTimeout(this.peticionOut);
    }
    // Programamos nueva ejecución
    this.peticionOut = setTimeout(() => {
      this.loadProducts(
        1,
        10,
        this.category(),
        this.searchWord()
      );
    }, 500);
  }

  // ============================================================
  // ===================== DATA LAYER ===========================
  // ============================================================

  // Método principal que carga productos
  private async loadProducts(
    page?: number,
    limit?: number,
    category?: string,
    searchword?: string
  ): Promise<void> {

    // Usar valores de los signals si no se proporcionan
    const finalPage = page ?? this.currentPage();
    const finalLimit = limit ?? this.currentLimit();
    const finalCategory = category ?? this.category();
    const finalSearchWord = searchword ?? this.searchWord();

    // Validaciones básicas
    if (finalPage < 1) {
      this.currentPage.set(1);
      return;
    }
    if (finalLimit < 1) {
      this.currentLimit.set(10);
      return;
    }

    // Actualizar signals
    this.currentPage.set(finalPage);
    this.currentLimit.set(finalLimit);
    this.category.set(finalCategory);
    this.searchWord.set(finalSearchWord);

    this.loading.set(true);

    try {
      const response: ApiResponse<Product[]> = await firstValueFrom(this.searchService.searchProducts({
        category: finalCategory,
        searchword: finalSearchWord,
        page: finalPage,
        limit: finalLimit
      }));

      this.products.set(response.data || []); 
      
      // Usar meta de la respuesta o fallback con valores actualizados
      const fallbackMeta = {
        limit: finalLimit,
        current_page: finalPage,
        total_pages: 1,
        total_items: 0,
        has_next: false,
        has_prev: false
      };
      
      this.meta.set(response.meta || fallbackMeta);

    } catch (error) {
      console.error('Error cargando productos', error);
      this.products.set([]);
      this.meta.set({ 
        limit: finalLimit, 
        current_page: finalPage, 
        total_pages: 1, 
        total_items: 0, 
        has_next: false, 
        has_prev: false 
      });
    } finally {
      this.loading.set(false);
    }
  }

  // ============================================================
  // ===================== ACTION METHODS =======================
  // ============================================================

  private editProduct(product: any): void {
    console.log('Editar:', product);
    this.notification.info(`Editando producto ${product.name}`);
    this.router.navigate(['/admin/product-form', product.id]);
  }

  private viewProduct(product: any): void {
    console.log('Ver:', product);
    this.notification.info(`Viendo detalles de ${product.name}`);
  }

  private deleteProduct(product: any): void {
    console.log('Eliminar:', product);
    this.notification.warning(`Producto ${product.name} eliminado`);
  }
}

