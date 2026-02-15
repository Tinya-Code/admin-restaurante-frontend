import { Component, inject, signal } from '@angular/core';
import {
  DataTable,
  TableColumn,
  TableAction,
  PaginationMeta,
} from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
import type { Category } from '../../../../../core/models/category.model';
import { SearchBar } from '../../../../../shared/components/search-bar/search-bar';
import { CategoryService } from '../../services/category';
import { Notification } from '../../../../../core/services/notification';
import { firstValueFrom } from 'rxjs';
import { Button } from '../../../../../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list-page',
  imports: [DataTable, SearchBar, Button],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
})
export class CategoryListPage {
  readonly loading = signal(false);
  readonly categories = signal<Category[]>([]);
  readonly meta = signal<PaginationMeta>({
    limit: 10,
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false,
  });

  searchWord = signal<string | undefined>(undefined);
  currentPage = signal<number>(1);
  currentLimit = signal<number>(10);

  private categoryService = inject(CategoryService);
  private notification = inject(Notification);
  private router = inject(Router);

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', width: '250px', mobileOrder: 1 },
    {
      key: 'created_at',
      label: 'Creado',
      width: '150px',
      hideOnMobile: true,
      pipe: 'date',
    },
    {
      key: 'updated_at',
      label: 'Actualizado',
      width: '150px',
      hideOnMobile: true,
      pipe: 'date',
    },
  ];

  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row) => this.editCategory(row),
    },
    {
      label: 'Ver detalles',
      icon: Eye,
      handler: (row) => this.viewCategory(row),
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
      handler: (row) => this.deleteCategory(row),
    },
  ];

  ngOnInit(): void {
    this.loadCategories();
  }

  onSearchChange(searchWord: string): void {
    if (this.searchWord() === searchWord) return;
    this.searchWord.set(searchWord);
    this.currentPage.set(1);
    this.loadCategories();
  }
  onToggleChange(event: { row: Category; enabled: boolean }): void {
    this.categoryService.updateCategoryStatus(event.row.id, event.enabled).subscribe({
      next: () => {
        this.notification.success(
          `Categoría ${event.row.name} ${event.enabled ? 'habilitada' : 'deshabilitada'}`,
        );
      },
      error: () => {
        this.notification.error('No se pudo actualizar el estado');
      },
    });
  }

  onPageChange(page: number): void {
    const currentMeta = this.meta();
    if (page < 1) return;
    if (currentMeta.total_pages > 0 && page > currentMeta.total_pages) return;
    this.currentPage.set(page);
    this.loadCategories(this.currentPage(), this.currentLimit());
  }

  onCategoryClick(category: any): void {
    console.log('Categoría:', category);
  }

  private async loadCategories(page?: number, limit?: number, searchWord?: string): Promise<void> {
    const finalPage = page ?? this.currentPage();
    const finalLimit = limit ?? this.currentLimit();
    const finalSearchWord = searchWord ?? this.searchWord();

    this.loading.set(true);

    try {
      const response = await firstValueFrom(
        this.categoryService.getCategories({
          page: finalPage,
          limit: finalLimit,
          search: finalSearchWord,
        }),
      );

      this.categories.set(response.data || []);
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

      this.notification.success('Categorías cargadas correctamente');
    } catch (error) {
      console.error('Error cargando categorías', error);
      this.categories.set([]);
      this.meta.set({
        limit: finalLimit,
        current_page: finalPage,
        total_pages: 1,
        total_items: 0,
        has_next: false,
        has_prev: false,
      });
      this.notification.error('Error al cargar categorías');
    } finally {
      this.loading.set(false);
    }
  }

  private editCategory(category: any): void {
    console.log('Editar:', category);
    this.notification.info(`Editando categoría ${category.name}`);
    this.router.navigate(['/admin/category-form', category.id]);
  }

  private viewCategory(category: any): void {
    console.log('Ver:', category);
    this.notification.info(`Viendo detalles de ${category.name}`);
  }

  private deleteCategory(category: any): void {
    console.log('Eliminar:', category);
    this.notification.warning(`Categoría ${category.name} eliminada`);
    // Aquí podrías llamar a categoryService.deleteCategory(category.id)
  }
}
