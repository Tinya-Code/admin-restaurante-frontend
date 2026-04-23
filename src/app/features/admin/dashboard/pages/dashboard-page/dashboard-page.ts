import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  Box,
  ChartNoAxesColumn,
  Edit,
  HandPlatter,
  LucideAngularModule,
  Package,
  QrCode,
  Share2,
  Utensils,
} from 'lucide-angular';
import { take } from 'rxjs';
import {
  DataTable,
  PaginationMeta,
  TableAction,
  TableColumn,
} from '../../../../../shared/components/data-table/data-table';
import { StatsCard, StatsCardVariant } from '../../components/stats-card/stats-card';
import { InitialDataButton } from '../../../../../shared/components/initial-data-button/initial-data-button';
import { DashboardService } from '../../services/dashboard.service';
import { RecentProductItem, VisitsOverviewData } from '../../../../../core/models/statistics.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, StatsCard, DataTable, LucideAngularModule, InitialDataButton],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  // ── Loading ───────────────────────────────────────────────────────────
  readonly loading = signal(false);

  // ── Stat signals ──────────────────────────────────────────────────────
  readonly totalProducts   = signal<number>(0);
  readonly totalCategories = signal<number>(0);
  readonly totalCombos     = signal<number>(0);
  readonly recentProducts  = signal<RecentProductItem[]>([]);
  readonly visitsOverview  = signal<VisitsOverviewData | null>(null);

  readonly paginationMeta = signal<PaginationMeta>({
    limit: 5,
    current_page: 1,
    total_pages: 1,
    total_items: 5,
    has_next: false,
    has_prev: false,
  });

  // ── Table config ──────────────────────────────────────────────────────
  readonly columns: TableColumn[] = [
    { key: 'name',       label: 'Producto',          width: '250px', mobileOrder: 1 },
    { key: 'price',      label: 'Precio',             width: '120px', align: 'right', pipe: 'currency', pipeFormat: 'USD', mobileOrder: 2 },
    { key: 'created_at', label: 'Fecha de creación',  width: '150px', pipe: 'date', pipeFormat: 'dd/MM/yyyy', hideOnMobile: true },
  ];

  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row: RecentProductItem) => this.router.navigate(['/admin/menu/product-form', row.id]),
    },
  ];

  // ── Icons ─────────────────────────────────────────────────────────────
  readonly QrCodeIcon         = QrCode;
  readonly Share2Icon         = Share2;
  readonly PackageIcon        = Package;
  readonly BoxIcon            = Box;
  readonly HandPlatterIcon    = HandPlatter;
  readonly UtensilsIcon       = Utensils;
  readonly ChartIcon          = ChartNoAxesColumn;

  // ── Lifecycle ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (!this.dashboardService.checkCache()) this.loading.set(true);

    this.dashboardService
      .getDashboardStats()
      .pipe(take(1))
      .subscribe({
        next: (stats) => {
          this.totalProducts.set(stats.totalProducts);
          this.totalCategories.set(stats.totalCategories);
          this.totalCombos.set(stats.totalCombos);
          this.recentProducts.set(stats.recentProducts);
          this.visitsOverview.set(stats.visitsOverview);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  // ── Visit label helper ────────────────────────────────────────────────
  visitLabel(type: string): string {
    const labels: Record<string, string> = {
      view:     'Vistas',
      checkin:  'Check-ins',
      order:    'Órdenes',
      favorite: 'Favoritos',
    };
    return labels[type] ?? type;
  }

  visitPercent(count: number): number {
    const total = this.visitsOverview()?.total_visits ?? 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  visitVariant(type: string): StatsCardVariant {
    const map: Record<string, StatsCardVariant> = {
      view:     'primary',
      checkin:  'secondary',
      order:    'accent',
      favorite: 'success',
    };
    return map[type] ?? 'primary';
  }

  // ── Action buttons ────────────────────────────────────────────────────
  copyQRCode(): void    { console.log('Copy QR Code'); }
  shareMenuLink(): void { console.log('Share Menu Link'); }
  onPageChange(page: number): void { console.log('Page changed to:', page); }
}
