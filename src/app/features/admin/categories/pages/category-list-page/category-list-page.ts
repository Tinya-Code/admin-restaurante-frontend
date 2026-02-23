<<<<<<< HEAD
import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { DataTable, TableColumn, TableAction, PaginationMeta } from '../../../../../shared/components/data-table/data-table';
import categoriesData from '../../../../../data/categories.json';
import { SearchBar } from '../../../../../shared/components/search-bar/search-bar';
import { Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-category-list-page',
  imports: [DataTable, LucideAngularModule, SearchBar],
=======
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
>>>>>>> 968ef27a7c6790781948e8e6b50f08f0c6afd14d
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
})
export class CategoryListPage {
<<<<<<< HEAD
  private originalData = Array.isArray((categoriesData as any).data)
    ? (categoriesData as any).data
    : (categoriesData as any);

  readonly columns = signal<TableColumn[]>([
    { 
      key: 'name', 
      label: 'Nombre', 
      align: 'left', 
      width: '30%',
      mobileOrder: 1
    },
    { 
      key: 'created_at', 
      label: 'Creado', 
      pipe: 'date', 
      pipeFormat: 'dd/MM/yyyy',
      align: 'center', 
      width: '20%',
      mobileOrder: 3,
      hideOnMobile: true
    },
    { 
      key: 'update_at', 
      label: 'Actualizado', 
      pipe: 'date',
      pipeFormat: 'dd/MM/yyyy', 
      align: 'center', 
      width: '20%',
      hideOnMobile: true
    }
  ]);

  // ✅ Data source como signal
  readonly dataSource = signal<any[]>(this.originalData);

  // ✅ Meta de paginación como signal
  readonly meta = signal<PaginationMeta>({
    limit: 10,
    current_page: 1,
    total_pages: Math.ceil(this.originalData.length / 10),
    total_items: this.originalData.length,
    has_next: this.originalData.length > 10,
    has_prev: false,
  });

  // ✅ Estado de carga
  readonly loading = signal(false);

  // ✅ Término de búsqueda
  readonly searchTerm = signal('');

  // ✅ Acciones de fila (usando íconos Lucide)
  readonly actions = signal<TableAction[]>([
    {
      label: 'Editar',
      icon: Pencil,
      variant: 'default',
      handler: (row: any) => this.onEdit(row),
=======
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
>>>>>>> 968ef27a7c6790781948e8e6b50f08f0c6afd14d
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
<<<<<<< HEAD
      handler: (row: any) => this.onDelete(row),
    },
  ]);

  /**
   * Editar categoría
   */
  onEdit(row: any): void {
    console.log('✏️ Editar categoría:', row);
    alert(`Editar: ${row.name}`);
    // TODO: Navegar a página de edición
    // this.router.navigate(['/admin/categories/edit', row.id]);
  }

  /**
   * Eliminar categoría
   */
  onDelete(row: any): void {
    console.log('🗑️ Eliminar categoría:', row);
    
    const confirmed = confirm(`¿Estás seguro de eliminar la categoría "${row.name}"?`);
    
    if (confirmed) {
      this.loading.set(true);
      
      // Simular eliminación
      setTimeout(() => {
        const currentData = this.dataSource();
        const newData = currentData.filter(c => c.id !== row.id);
        
        this.dataSource.set(newData);
        this.meta.update(m => ({
          ...m,
          total_items: newData.length,
          total_pages: Math.ceil(newData.length / m.limit)
        }));
        
        this.loading.set(false);
        alert('Categoría eliminada exitosamente');
      }, 500);
    }
  }

  /**
   * Manejar búsqueda
   */
  handleSearch(term: string): void {
    this.searchTerm.set(term);
    
    if (!term.trim()) {
      // Restaurar datos originales
      this.dataSource.set(this.originalData);
      this.meta.update(m => ({
        ...m,
        total_items: this.originalData.length,
        total_pages: Math.ceil(this.originalData.length / m.limit),
        current_page: 1,
        has_next: this.originalData.length > m.limit,
        has_prev: false
      }));
      return;
    }

    // Filtrar por nombre
    const filtered = this.originalData.filter((category: any) =>
      category.name.toLowerCase().includes(term.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / this.meta().limit);

    this.dataSource.set(filtered);
    this.meta.update(m => ({
      ...m,
      total_items: filtered.length,
      total_pages: totalPages,
      current_page: 1,
      has_next: totalPages > 1,
      has_prev: false
    }));
  }

  /**
   * Manejar clic en fila
   */
  onRowClick(row: any): void {
    console.log('Fila seleccionada:', row);
  }

  /**
   * Manejar cambio de página
   */
  onPageChange(page: number): void {
    this.meta.update(m => ({
      ...m,
      current_page: page,
      has_next: page < m.total_pages,
      has_prev: page > 1
    }));
    
    console.log('Página cambiada a:', page);
  }

  /**
   * Manejar cambio de toggle
   */
  onToggleChange(event: { row: any; enabled: boolean }): void {
    console.log('Toggle cambiado:', event);
    // TODO: Actualizar estado en el backend
  }
}
=======
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
>>>>>>> 968ef27a7c6790781948e8e6b50f08f0c6afd14d
