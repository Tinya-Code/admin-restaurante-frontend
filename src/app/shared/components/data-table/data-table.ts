import { Component, input, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-angular';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => string;
}

export interface PaginationMeta {
  limit: number;
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface TableAction {
  label: string;
  icon?: any;
  variant?: 'default' | 'danger';
  handler: (row: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable {
  // Inputs
  readonly dataSource = input.required<any[]>();
  readonly meta = input.required<PaginationMeta>();
  readonly columns = input.required<TableColumn[]>();
  readonly imageKey = input<string>('');
  readonly statusKey = input<string>('is_available');
  readonly actions = input<TableAction[]>([]);
  readonly showToggle = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly emptyMessage = input<string>('No hay datos disponibles');

  // Outputs
  readonly rowClick = output<any>();
  readonly toggleChange = output<{ row: any; enabled: boolean }>();
  readonly pageChange = output<number>();

  // Icons
  readonly icons = {
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronsLeft: ChevronsLeft,
    chevronsRight: ChevronsRight,
    moreVertical: MoreVertical,
  } as const;

  // State
  readonly openMenuIndex = signal<number | null>(null);

  // Computed
  readonly pageNumbers = computed(() => {
    const meta = this.meta();
    const total = meta.total_pages;
    const current = meta.current_page;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }

    return pages;
  });

  readonly startIndex = computed(() => {
    const meta = this.meta();
    return (meta.current_page - 1) * meta.limit + 1;
  });

  readonly endIndex = computed(() => {
    const meta = this.meta();
    const data = this.dataSource();
    return Math.min(this.startIndex() + data.length - 1, meta.total_items);
  });

  // Pagination
  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }

  nextPage(): void {
    const meta = this.meta();
    if (meta.has_next) {
      this.pageChange.emit(meta.current_page + 1);
    }
  }

  previousPage(): void {
    const meta = this.meta();
    if (meta.has_prev) {
      this.pageChange.emit(meta.current_page - 1);
    }
  }

  firstPage(): void {
    this.pageChange.emit(1);
  }

  lastPage(): void {
    this.pageChange.emit(this.meta().total_pages);
  }

  // Helpers
  getCellValue(row: any, column: TableColumn): string {
    const value = row[column.key];
    return column.render ? column.render(value, row) : (value ?? '');
  }

  getImageUrl(row: any): string {
    return (
      row[this.imageKey()] ||
      'https://i.pinimg.com/1200x/47/49/9a/47499a5cd90f926e9506b4a47435a0eb.jpg'
    );
  }

  isToggleActive(row: any): boolean {
    return row[this.statusKey()] === true;
  }

  // Events
  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onToggleChange(row: any, event: Event): void {
    event.stopPropagation();
    const enabled = (event.target as HTMLInputElement).checked;
    this.toggleChange.emit({ row, enabled });
  }

  toggleMenu(index: number, event: Event): void {
    event.stopPropagation();
    this.openMenuIndex.set(this.openMenuIndex() === index ? null : index);
  }

  closeMenu(): void {
    this.openMenuIndex.set(null);
  }

  onActionClick(action: TableAction, row: any, event: Event): void {
    event.stopPropagation();
    action.handler(row);
    this.closeMenu();
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByKey(index: number, column: TableColumn): string {
    return column.key;
  }
}
