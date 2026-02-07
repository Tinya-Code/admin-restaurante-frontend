import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  Box,
  Edit,
  HandPlatter,
  LucideAngularModule,
  Package,
  QrCode,
  Share2,
} from 'lucide-angular';
import products from '../../../../../data/products.json';
import {
  DataTable,
  PaginationMeta,
  TableAction,
  TableColumn,
} from '../../../../../shared/components/data-table/data-table';
import { StatsCard } from '../../components/stats-card/stats-card';

interface Product {
  id: string;
  category_name: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  update_at: string;
}


@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, StatsCard, DataTable, LucideAngularModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  // Data from JSON files
  private products: Product[] = [];
  private categories: Category[] = [];

  constructor() {
    // Load data from JSON files
    this.loadData();
  }

  private loadData(): void {
    this.products = products;
  }

  // Computed values from real data
  readonly totalProducts = computed(() => this.products.length);
  readonly totalCategories = computed(
    () => this.categories.filter((category) => category.is_active).length
  );

  // Get 5 most recent products
  readonly recentProducts = computed(() => {
    return this.products
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category_name,
        price: product.price,
        image: product.image_url,
        created_at: product.created_at,
      }));
  });

  readonly paginationMeta = signal<PaginationMeta>({
    limit: 5,
    current_page: 1,
    total_pages: 1,
    total_items: 5,
    has_next: false,
    has_prev: false,
  });

  // DataTable configuration
  readonly columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Producto',
      width: '250px',
      mobileOrder: 1,
    },
    {
      key: 'category',
      label: 'Categoría',
      width: '150px',
      mobileOrder: 2,
    },
    {
      key: 'price',
      label: 'Precio',
      width: '120px',
      align: 'right',
      pipe: 'currency',
      pipeFormat: 'USD',
      mobileOrder: 3,
    },
    {
      key: 'created_at',
      label: 'Fecha de creación',
      width: '150px',
      pipe: 'date',
      pipeFormat: 'dd/MM/yyyy',
      hideOnMobile: true,
    },
  ];

  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row: Product) => this.editProduct(row),
    },
  ];

  // Icon references
  readonly QrCodeIcon = QrCode;
  readonly Share2Icon = Share2;
  readonly PackageIcon = Package;
  readonly BoxIcon = Box;
  readonly HandPlatterIcon = HandPlatter;

  // Mock methods for action buttons
  copyQRCode(): void {
    console.log('Copy QR Code ');
  }

  shareMenuLink(): void {
    console.log('Share Menu Link ');
  }

  editProduct(product: Product): void {
    console.log('Edit product:', product);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
