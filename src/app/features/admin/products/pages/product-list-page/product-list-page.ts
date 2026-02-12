import { Component, inject, signal } from '@angular/core';
import {
  DataTable,
  TableColumn,
  TableAction,
  PaginationMeta,
} from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye, Inbox } from 'lucide-angular';
import type { Product } from '../../../../../core/models/product.model';
import { CategoryList } from '../../components/category-list/category-list';
import { SearchBar } from '../../../../../shared/components/search-bar/search-bar';
import { ProductService } from '../../services/product';
import { Notification } from '../../../../../core/services/notification';
import { firstValueFrom } from 'rxjs';
import { Button } from '../../../../../shared/components/button/button';
import { Storage } from '../../../../../core/services/storage';

@Component({
  selector: 'app-product-list-page',
  imports: [DataTable, CategoryList, SearchBar, Button],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  // ============================================================
  // ===================== STATE (Signals) ======================
  // ============================================================


  readonly loading = signal(false);
  readonly products = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta>({
    limit: 10,
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false,
  });

category = signal<string | undefined>(undefined);
searchWord = signal<string | undefined>(undefined);


  currentPage = signal<number>(1);
  currentLimit = signal<number>(10);

  // ============================================================
  // ===================== SERVICES =============================
  // ============================================================

  private productService = inject(ProductService);
  private notification = inject(Notification);

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
      pipe: 'currency',
    },
    {
      key: 'created_at',
      label: 'Creado',
      width: '150px',
      hideOnMobile: true,
      pipe: 'date',
    },
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
    this.loadProducts();
  }

  // ============================================================
  // ===================== EVENT HANDLERS =======================
  // ============================================================

  onCategoryChange(category: string): void {
    if (this.category() === category) return;
    this.category.set(category);
    this.currentPage.set(1);
  }

  onSearchChange(searchWord: string): void {
    if (this.searchWord() === searchWord) return;
    this.searchWord.set(searchWord);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    const currentMeta = this.meta();
    if (page < 1) return;
    if (currentMeta.total_pages > 0 && page > currentMeta.total_pages) return;
    this.currentPage.set(page);
    this.loadProducts(this.currentPage(), this.currentLimit());
  }

  onProductClick(product: any): void {
    console.log('Producto:', product);
  }

  onToggleChange(event: { row: any; enabled: boolean }): void {
    console.log('Toggle:', event);
  }

  // ============================================================
  // ===================== DATA LAYER ===========================
  // ============================================================

  private async loadProducts(
    page?: number,
    limit?: number,
    category_id?: string,
    searchWord?: string,
  ): Promise<void> {
    const finalPage = page ?? this.currentPage();
    const finalLimit = limit ?? this.currentLimit();
    const finalCategory = category_id ?? this.category();
    const finalSearchWord = searchWord ?? this.searchWord();

    this.loading.set(true);

    try {
      const response = await firstValueFrom(
        this.productService.getProducts({
          page: finalPage,
          limit: finalLimit,
          category_id: finalCategory,
          search: finalSearchWord,
        }),
      );

      this.products.set(response.data || []);
      this.meta.set(
        response.meta || {
          limit: finalLimit,
          current_page: finalPage,
          total_pages: 1,
          total_items: 0,
          has_next: false,
          has_prev: false,
        },
      );

      this.notification.success('Productos cargados correctamente');
    } catch (error) {
      console.error('Error cargando productos', error);
      this.products.set([]);
      this.meta.set({
        limit: finalLimit,
        current_page: finalPage,
        total_pages: 1,
        total_items: 0,
        has_next: false,
        has_prev: false,
      });
      this.notification.error('Error al cargar productos');
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
