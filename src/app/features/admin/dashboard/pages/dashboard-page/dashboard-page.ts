import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  Box,
  Edit,
  HandPlatter,
  LucideAngularModule,
  Package,
  QrCode,
  Share2,
} from 'lucide-angular';
import { take } from 'rxjs';
import {
  DataTable,
  PaginationMeta,
  TableAction,
  TableColumn,
} from '../../../../../shared/components/data-table/data-table';
import { StatsCard } from '../../components/stats-card/stats-card';
import { DashboardService } from '../../services/dashboardService';
import { Storage } from '../../../../../core/services/storage';

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
export class DashboardPage implements OnInit{
  // Data from JSON files
  private products: Product[] = [];
  private categories: Category[] = [];
  private storage = inject(Storage);
  private dashboardService = inject(DashboardService);

  constructor() {
    // Load data from JSON files
  
  }
ngOnInit(): void {
  this.storage.set("restaurant_id","5a53d32f-834d-43df-a9ed-5db9b6badef9")
    this.loadData();
}
  private loadData(): void {
    this.dashboardService
      .getDashboardStats()
      .pipe(take(1))
      .subscribe((stats) => {
        this.recentProducts.set(stats.recentProducts);
        this.totalProducts.set(stats.totalProducts);
        this.totalCategories.set(stats.totalCategories);
      });
  }

  // Computed values from real data
  readonly totalProducts = signal<number>(0);
  readonly totalCategories = signal<number>(0);

  // Get 5 most recent products
  readonly recentProducts = signal<Product[]>([]);

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
