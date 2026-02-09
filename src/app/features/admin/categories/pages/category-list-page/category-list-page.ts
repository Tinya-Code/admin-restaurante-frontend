import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { DataTable, TableColumn, TableAction, PaginationMeta } from '../../../../../shared/components/data-table/data-table';
import categoriesData from '../../../../../data/categories.json';
import { SearchBar } from '../../../../../shared/components/search-bar/search-bar';
import { Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-category-list-page',
  imports: [DataTable, LucideAngularModule, SearchBar],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
})
export class CategoryListPage {
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
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
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