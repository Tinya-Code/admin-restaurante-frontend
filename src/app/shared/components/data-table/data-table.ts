import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight,MoreVertical, ChevronsLeft, ChevronsRight } from 'lucide-angular';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string; // ej: '200px', '20%', 'auto'
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => string; // función personalizada para renderizar
}

export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions: number[];
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  // Inputs con signals
  dataSource = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  pagination = input<PaginationConfig>({ 
    pageSize: 10, 
    pageSizeOptions: [10, 25, 50, 100] 
  });
  loading = input<boolean>(false);
  emptyMessage = input<string>('No hay datos disponibles');

  // Outputs
  rowClick = output<any>();

  // Iconos de Lucide
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ChevronsLeft = ChevronsLeft;
  readonly ChevronsRight = ChevronsRight;
  readonly morevertical = MoreVertical;

  // Estado interno
  currentPage = signal(1);
  pageSize = signal(10);

  // Computed signals
  totalPages = computed(() => {
    const total = this.dataSource().length;
    const size = this.pageSize();
    return Math.ceil(total / size) || 1;
  });

  paginatedData = computed(() => {
    const data = this.dataSource();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    const end = start + size;
    return data.slice(start, end);
  });

  startIndex = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    return (page - 1) * size + 1;
  });

  endIndex = computed(() => {
    const start = this.startIndex();
    const size = this.pageSize();
    const total = this.dataSource().length;
    return Math.min(start + size - 1, total);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2; // Páginas a mostrar antes y después de la actual
    const pages: (number | string)[] = [];

    if (total <= 7) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con puntos suspensivos
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - delta; i <= current + delta; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });

  constructor() {
    // Inicializar pageSize con el valor de pagination
    this.pageSize.set(this.pagination().pageSize);
  }

  // Métodos de paginación
  goToPage(page: number | string): void {
    if (typeof page === 'string') return; // Ignorar clicks en "..."
    
    const pageNum = Number(page);
    if (pageNum >= 1 && pageNum <= this.totalPages()) {
      this.currentPage.set(pageNum);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  firstPage(): void {
    this.currentPage.set(1);
  }

  lastPage(): void {
    this.currentPage.set(this.totalPages());
  }

  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = Number(select.value);
    this.pageSize.set(newSize);
    this.currentPage.set(1); // Reset a primera página
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  getCellValue(row: any, column: TableColumn): any {
    const value = row[column.key];
    
    // Si hay función de render personalizada, usarla
    if (column.render) {
      return column.render(value, row);
    }
    
    return value;
  }

  getColumnWidth(column: TableColumn): string {
    return column.width || 'auto';
  }

  getTextAlign(column: TableColumn): string {
    return column.align || 'left';
  }
}