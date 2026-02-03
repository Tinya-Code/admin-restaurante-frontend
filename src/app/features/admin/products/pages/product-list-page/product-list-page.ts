import { Component, signal } from '@angular/core';
import { DataTable, TableColumn, TableAction , PaginationMeta} from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
import type { Product } from '../../../../../core/models/product.model';
import productPaginate from '../../../../../data/productsPaginate.json';
import categoriesPaginate from '../../../../../data/categoriesPaginate.json';

interface ApiResponse {
  status: string;
  code: string;
  message: string;
  data: any[];
  meta: PaginationMeta;
}

@Component({
  selector: 'app-product-list-page',
  imports: [DataTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css'
})
export class ProductListPage {
   readonly loading = signal(false);
  readonly products = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta>({
    limit: 10,
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false
  });

  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '120px' },
    { key: 'name', label: 'Producto', width: '250px' },
    { key: 'category_name', label: 'Categoría', width: '150px' },
    { 
      key: 'price', 
      label: 'Precio', 
      width: '120px', 
      align: 'right',
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    { 
      key: 'created_at', 
      label: 'Creado', 
      width: '150px',
      render: (value) => new Date(value).toLocaleDateString('es-PE')
    },
  ];

  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row) => this.editProduct(row)
    },
    {
      label: 'Ver detalles',
      icon: Eye,
      handler: (row) => this.viewProduct(row)
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
      handler: (row) => this.deleteProduct(row)
    }
  ];

  ngOnInit(): void {
    this.loadProducts(1, 10);
  }

  private async loadProducts(page: number, limit: number): Promise<void> {
    this.products.set(productPaginate.data);
    this.meta.set(productPaginate.meta);
 
  }


  onPageChange(page: number): void {
    this.loadProducts(page, this.meta().limit);
  }

  onProductClick(product: any): void {
    console.log('Producto:', product);
  }

  onToggleChange(event: { row: any; enabled: boolean }): void {
    console.log('Toggle:', event);
    // API call: updateProductStatus(event.row.id, event.enabled)
  }

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