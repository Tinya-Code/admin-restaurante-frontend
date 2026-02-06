import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { DataTable, TableColumn, TableAction, PaginationMeta } from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
import categoriesData from '../../../../../data/categories.json';

@Component({
  selector: 'app-category-list-page',
  imports: [DataTable, LucideAngularModule],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
})
export class CategoryListPage {
  // ✅ Configuración de columnas
  columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', width: '40%', align: 'left' },
    { key: 'is_active', label: 'Estado', align: 'center' },
    { key: 'created_at', label: 'Creado', pipe: 'date', align: 'center' },
  ];

  // ✅ Fuente de datos (adaptable)
  dataSource = Array.isArray((categoriesData as any).data)
    ? (categoriesData as any).data
    : (categoriesData as any);

  // ✅ Meta de paginación simulada (si no usas backend)
  meta = {
    limit: 10,
    current_page: 1,
    total_pages: 1,
    total_items: this.dataSource.length,
    has_next: false,
    has_prev: false,
  };

  // ✅ Acciones de fila (usando íconos Lucide)
  actions: TableAction[] = [
    {
      label: 'Editar',
      icon: 'edit',
      handler: (row: any) => alert(`Editar: ${row.name}`),
    },
    {
      label: 'Eliminar',
      icon: 'trash',
      variant: 'danger',
      handler: (row: any) => alert(`Eliminar: ${row.name}`),
    },
  ];

  // ✅ Manejadores de eventos
  onRowClick(row: any) {
    console.log('Fila seleccionada:', row);
  }

  onPageChange(page: number) {
    this.meta.current_page = page;
  }

  onToggleChange(event: { row: any; enabled: boolean }) {
    console.log('Toggle cambiado:', event);
  }
}