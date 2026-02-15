import { Component, inject, signal } from '@angular/core';
import { DataTable, TableColumn, TableAction , PaginationMeta } 
  from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
import type { Product } from '../../../../../core/models/product.model';
import productPaginate from '../../../../../data/productsPaginate.json';
import { CategoryList } from "../../components/category-list/category-list";
import { SearchBar } from "../../../../../shared/components/search-bar/search-bar";
import { ApiResponse } from "../../../../../core/models/api-response.model";
import { Api } from "../../../../../core/http/api";
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-product-list-page',
  imports: [DataTable, CategoryList, SearchBar],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {

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
    this.getController(); // dispara petición con debounce manual
  }

  /**
   * Cambia la palabra de búsqueda.
   * Solo actualiza signal (no dispara aún).
   */
  onSearchChange(searchWord: string): void {
    if (this.searchWord() === searchWord) return;

    this.searchWord.set(searchWord);
    this.currentPage.set(1); // Resetear a primera página
    // Puedes decidir aquí si quieres llamar getController()
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
  // ============================================================

  /**
   * Contenedor para debounce manual.
   * Guarda el ID del setTimeout activo.
   */
  private peticionOut: any;

  /**
   * Controlador de peticiones con debounce manual.
   *
   * - Cancela timeout anterior si existe.
   * - Programa nueva petición después de 500ms.
   *
   * Esto evita disparar múltiples requests seguidos
   * mientras el usuario interactúa rápido.
   */
  private getController(): void {

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

  /**
   * Injectamos servicio de Api
   */
  private api = inject(Api);
  
  /**
   * Método principal que carga productos.
   *
   * Aquí debería:
   * - activar loading
   * - llamar API real
   * - actualizar signals
   * - manejar errores
   */
  private async loadProducts(
    page?: number,
    limit?: number,
    category?: string,
    searchWord?: string
  ): Promise<void> {

    // Usar valores de los signals si no se proporcionan
    const finalPage = page ?? this.currentPage();
    const finalLimit = limit ?? this.currentLimit();
    const finalCategory = category ?? this.category();
    const finalSearchWord = searchWord ?? this.searchWord();

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
      const response = await this.getProduct(finalCategory, finalSearchWord, finalPage, finalLimit);

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

  /**
   * Método de request al backend con paginación y filtros.
   * 
   * Aquí debería:
   * - construir los parámetros de la query
   * - hacer la petición HTTP
   * - retornar la respuesta
   */
  async getProduct(
    category: string,
    searchWord: string = '',
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Product[]>> {

    try {
      // Construir query string para búsqueda
      const queryParams = new URLSearchParams();
      // si no existe searchWord, no se agrega el parámetro
      if (searchWord) {
        queryParams.append('keyword', searchWord);
      }
      
      if (category) {
        queryParams.append('category', category);
      }
      
      // Construir URL completa
      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : '/products';
      
      // Params para paginación (el interceptor agrega el token automáticamente)
      const paginationParams: { [key: string]: number } = {
        page: page,
        limit: limit
      };
      
      const response: ApiResponse<Product[]> = await firstValueFrom(
        this.api.get<Product[]>(url, { 
          params: paginationParams 
        })
      );
      
      return response;

    } catch (error) {
      console.log(
        `error en conseguir productos de categoria ${category} o por palabra clave ${searchWord}`,
        error
      );
      throw error;
    }
  }

  // ============================================================
  // ===================== ACTION METHODS =======================
  // ============================================================

  private editProduct(product: any): void {
    console.log('Editar:', product);
  }

  private viewProduct(product: any): void {
    console.log('Ver:', product);
  }

  private deleteProduct(product: any): void {
    console.log('Eliminar:', product);
  }
}

