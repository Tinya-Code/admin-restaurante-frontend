import { Component , signal} from '@angular/core';
import { DataTable } from '../../../../../shared/components/data-table/data-table';
import type { Product } from '../../../../../core/models/product.model';
import type { TableColumn } from '../../../../../shared/components/data-table/data-table';
import productsPaginate from '../../../../../data/productsPaginate.json';
@Component({
  selector: 'app-product-list-page',
  imports: [DataTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
loading = signal(false);
  products = signal<Product[]>(productsPaginate.data);

  paginationConfig = {
    pageSize: productsPaginate.meta.total_pages,
    pageSizeOptions: [25, 50, 100]
  };

  columns: TableColumn[] = [
    { 
      key: 'id', 
      label: 'ID', 

    },
    { 
      key: 'name', 
      label: 'Producto',

    },
    { 
      key: 'category_name', 
      label: 'Categoría',

    },
    { 
      key: 'price', 
      label: 'Precio',

      render: (value) => `$${value.toFixed(2)}`
    },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (value) => value > 0 ? `${value}` : 'Agotado'
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value) => value === 'active' ? '✓ Activo' : '✗ Inactivo'
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading.set(true);
    
    try {
      // Simulación de llamada al backend
      const response = await fetch('/api/products');
      const data = await response.json();
      this.products.set(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onProductClick(product: Product): void {
    console.log('Producto clickeado:', product);
    // Navegar a detalle del producto
  }
}
