# Componente DataTable - Documentación

## Descripción General
DataTable es un componente de tabla reutilizable para Angular con funcionalidades completas de paginación, ordenación, acciones personalizadas y diseño responsivo. Está diseñado para mostrar datos tabulares con soporte para imágenes, toggles de estado y menús contextuales.

## Características Principales
- ✅ Paginación avanzada con navegación completa
- ✅ Diseño responsivo (mobile/desktop)
- ✅ Columnas configurables con renderizado personalizado
- ✅ Sistema de acciones contextuales
- ✅ Toggles de estado interactivos
- ✅ Carga y estados vacíos
- ✅ Performance optimizado (ChangeDetectionStrategy.OnPush)
- ✅ Tracking por índices y claves
- ✅ Icons de Lucide integrados

## Instalación y Configuración

### 1. Importar en tu módulo/componente
```typescript
import { DataTable } from './ruta/al/data-table.component';
```

### 2. Estructura de Interfaces
```typescript
// Columnas de la tabla
interface TableColumn {
  key: string;           // Key del objeto de datos
  label: string;         // Texto del encabezado
  width?: string;        // Ancho opcional (ej: '120px')
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => string; // Función de renderizado
}

// Metadatos de paginación
interface PaginationMeta {
  limit: number;
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

// Acciones personalizadas
interface TableAction {
  label: string;
  icon?: any;            // Icono de Lucide
  variant?: 'default' | 'danger';
  handler: (row: any) => void; // Función ejecutada al hacer clic
}
```

## Uso Básico

### En el Componente TypeScript
```typescript
@Component({
  selector: 'app-mi-componente',
  imports: [DataTable],
  template: `
    <app-data-table
      [dataSource]="misDatos()"
      [meta]="paginacion()"
      [columns]="columnas"
      [actions]="acciones"
      (rowClick)="onFilaClic($event)"
      (pageChange)="onCambioPagina($event)"
    />
  `
})
export class MiComponente {
  // Datos y paginación
  readonly misDatos = signal<any[]>([]);
  readonly paginacion = signal<PaginationMeta>({...});
  
  // Configuración de columnas
  readonly columnas: TableColumn[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'nombre', label: 'Nombre' },
    { 
      key: 'precio', 
      label: 'Precio',
      align: 'right',
      render: (value) => `$${Number(value).toFixed(2)}`
    }
  ];
  
  // Acciones disponibles
  readonly acciones: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row) => this.editarItem(row)
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
      handler: (row) => this.eliminarItem(row)
    }
  ];
  
  // Métodos de eventos
  onFilaClic(row: any) {
    console.log('Fila clicada:', row);
  }
  
  onCambioPagina(pagina: number) {
    this.cargarDatos(pagina);
  }
}
```

## Propiedades (Inputs)

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `dataSource` | `any[]` | ✅ | Array de datos a mostrar |
| `meta` | `PaginationMeta` | ✅ | Metadatos de paginación |
| `columns` | `TableColumn[]` | ✅ | Definición de columnas |
| `imageKey` | `string` | ❌ | Key para mostrar imágenes (ej: 'image_url') |
| `statusKey` | `string` | ❌ | Key para toggle de estado (default: 'is_available') |
| `actions` | `TableAction[]` | ❌ | Lista de acciones por fila |
| `showToggle` | `boolean` | ❌ | Muestra toggle de estado (default: false) |
| `loading` | `boolean` | ❌ | Estado de carga (default: false) |
| `emptyMessage` | `string` | ❌ | Mensaje cuando no hay datos |

## Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `rowClick` | `any` | Se dispara al hacer clic en una fila |
| `toggleChange` | `{ row: any, enabled: boolean }` | Cambio en toggle de estado |
| `pageChange` | `number` | Cambio de página |

## Métodos de Utilidad

### `getCellValue(row: any, column: TableColumn): string`
Obtiene el valor de una celda aplicando la función `render` si existe.

### `getImageUrl(row: any): string`
Obtiene la URL de la imagen o una por defecto si no existe.

### `isToggleActive(row: any): boolean`
Verifica si el toggle está activo basado en `statusKey`.

## Ejemplo Completo - Lista de Productos

```typescript
@Component({
  selector: 'app-product-list',
  imports: [DataTable],
  template: `
    <app-data-table
      [dataSource]="products()"
      [meta]="meta()"
      [columns]="columns"
      [imageKey]="'image_url'"
      [statusKey]="'is_available'"
      [actions]="tableActions"
      [showToggle]="true"
      [loading]="loading()"
      [emptyMessage]="'No hay productos disponibles'"
      (rowClick)="onProductClick($event)"
      (toggleChange)="onToggleChange($event)"
      (pageChange)="onPageChange($event)"
    />
  `
})
export class ProductListComponent {
  readonly loading = signal(false);
  readonly products = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta>({...});
  
  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '120px' },
    { key: 'name', label: 'Producto', width: '250px' },
    { key: 'category_name', label: 'Categoría', width: '150px' },
    { 
      key: 'price', 
      label: 'Precio', 
      width: '120px', 
      align: 'right',
      render: (value) => `$${Number(value).toFixed(2)}`
    }
  ];
  
  readonly tableActions: TableAction[] = [
    { label: 'Editar', icon: Edit, handler: (row) => this.editProduct(row) },
    { label: 'Eliminar', icon: Trash2, variant: 'danger', handler: (row) => this.deleteProduct(row) }
  ];
  
  onPageChange(page: number) {
    this.loadProducts(page, this.meta().limit);
  }
}
```

## Estilos Personalizados

El componente incluye estilos Tailwind por defecto, pero puedes sobrescribirlos:

```css
/* En tu componente padre */
::ng-deep app-data-table {
  .bg-gray-50 {
    background-color: #f9fafb; /* Sobrescribe el color de fondo */
  }
  
  .border-gray-200 {
    border-color: #e5e7eb;
  }
}
```

## Responsive Design

El componente se adapta automáticamente:

- **Desktop**: Tabla completa con todas las columnas visibles
- **Mobile**: Vista condensada con imagen, información principal y acciones

## Consideraciones de Performance

- Usa `ChangeDetectionStrategy.OnPush` para optimizar la detección de cambios
- Implementa `trackBy` functions para evitar re-renderizados innecesarios
- Los signals aseguran reactividad eficiente

## Tips y Mejores Prácticas

1. **Paginación desde el servidor**: Siempre maneja la paginación en el backend
2. **Renderizado personalizado**: Usa la función `render` para formatear datos complejos
3. **Acciones contextuales**: Define acciones específicas para cada tipo de dato
4. **Loading states**: Siempre muestra el estado de carga durante operaciones async
5. **Manejo de errores**: Implementa lógica para errores de carga de datos

## Limitaciones Conocidas

- No incluye ordenación por columnas (se puede agregar como feature futura)
- El diseño mobile está optimizado para listas de productos, puede necesitar ajustes para otros datos
- Los filtros deben implementarse en el componente padre

## Ejemplo de API Response

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Producto Ejemplo",
      "category_name": "Categoría",
      "price": 29.99,
      "image_url": "https://...",
      "is_available": true
    }
  ],
  "meta": {
    "limit": 10,
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "has_next": true,
    "has_prev": false
  }
}
```