import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  Box,
  Edit,
  HandPlatter,
  LucideAngularModule,
  Package,
  QrCode,
  Share2,
} from 'lucide-angular';
import {
  DataTable,
  PaginationMeta,
  TableAction,
  TableColumn,
} from '../../../../../shared/components/data-table/data-table';
import { StatsCard } from '../../components/stats-card/stats-card';

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  created_at: string;
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
  // Mock data
  readonly totalProducts = signal(156);
  readonly totalCategories = signal(12);

  readonly recentProducts = signal<Product[]>([
    {
      id: 1,
      image: 'https://via.placeholder.com/150',
      name: 'Pizza Margarita',
      category: 'Pizzas',
      price: 12.99,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150',
      name: 'Hamburguesa Clásica',
      category: 'Hamburguesas',
      price: 8.99,
      created_at: '2024-01-14T15:20:00Z',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/150',
      name: 'Ensalada César',
      category: 'Ensaladas',
      price: 6.99,
      created_at: '2024-01-13T12:10:00Z',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/150',
      name: 'Pasta Carbonara',
      category: 'Pastas',
      price: 10.99,
      created_at: '2024-01-12T18:45:00Z',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/150',
      name: 'Tacos de Carnitas',
      category: 'Tacos',
      price: 9.99,
      created_at: '2024-01-11T14:30:00Z',
    },
  ]);

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
