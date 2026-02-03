# Componente DataTable - Documentación Completa

## Descripción General
DataTable es un componente de tabla reutilizable para Angular con funcionalidades completas de paginación, acciones personalizadas, pipes nativos y diseño responsivo adaptable a mobile. Está diseñado para mostrar datos tabulares con soporte para imágenes, toggles de estado y menús contextuales.

## Características Principales
- ✅ Paginación avanzada con navegación completa
- ✅ Diseño responsivo (mobile/desktop) con configuración personalizable
- ✅ Columnas configurables con pipes nativos de Angular
- ✅ Sistema de acciones contextuales con menú dropdown
- ✅ Toggles de estado interactivos
- ✅ Estados de carga y vacíos
- ✅ Performance optimizado (ChangeDetectionStrategy.OnPush)
- ✅ Tracking por índices y claves
- ✅ Icons de Lucide integrados
- ✅ Soporte para múltiples pipes (currency, date, number, percent, uppercase, lowercase)
- ✅ Configuración flexible de campos móviles

## Instalación y Configuración

### 1. Importar en tu módulo/componente
```typescript
import { DataTable, TableColumn, TableAction, PaginationMeta } from './shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
```

## 2. Interfaces y Tipos (IMPORTANTE) ⚠️

### TableColumn (Configuración de Columnas)
```typescript
interface TableColumn {
  key: string;                    // ✅ REQUERIDO: Key del objeto de datos
  label: string;                  // ✅ REQUERIDO: Texto del encabezado
  width?: string;                 // ❌ OPCIONAL: Ancho (ej: '120px', '25%')
  align?: 'left' | 'center' | 'right';  // ❌ OPCIONAL: Alineación (default: 'left')
  pipe?: 'currency' | 'date' | 'number' | 'percent' | 'uppercase' | 'lowercase';  // ❌ OPCIONAL: Pipe a aplicar
  pipeFormat?: string;            // ❌ OPCIONAL: Formato del pipe (ej: 'dd/MM/yyyy', 'USD')
  mobileOrder?: number;           // ❌ OPCIONAL: Orden en mobile (1 = título, 2 = subtítulo, 3+ = metadata)
  hideOnMobile?: boolean;         // ❌ OPCIONAL: Ocultar columna en mobile (default: false)
}
```

**Ejemplo de uso:**
```typescript
readonly columns: TableColumn[] = [
  { 
    key: 'id',              // Campo del objeto: product.id
    label: 'ID',            // Encabezado de la columna
    width: '120px',         // Ancho fijo
    hideOnMobile: true      // No mostrar en mobile
  },
  { 
    key: 'name',            // Campo del objeto: product.name
    label: 'Producto', 
    width: '250px',
    mobileOrder: 1          // En mobile: Título principal (h3, negro, bold)
  },
  { 
    key: 'price',           // Campo del objeto: product.price
    label: 'Precio', 
    align: 'right',         // Alineado a la derecha
    pipe: 'currency',       // Aplicar pipe de moneda
    pipeFormat: 'USD',      // Formato: dólares americanos
    mobileOrder: 3          // En mobile: Metadata (span inline)
  },
  { 
    key: 'created_at',      // Campo del objeto: product.created_at
    label: 'Creado',
    pipe: 'date',           // Aplicar pipe de fecha
    pipeFormat: 'dd/MM/yyyy', // Formato: día/mes/año
    hideOnMobile: true      // Ocultar en mobile
  }
];
```

### PaginationMeta (Metadatos de Paginación)
```typescript
interface PaginationMeta {
  limit: number;           // ✅ REQUERIDO: Cantidad de items por página
  current_page: number;    // ✅ REQUERIDO: Página actual (empieza en 1)
  total_pages: number;     // ✅ REQUERIDO: Total de páginas
  total_items: number;     // ✅ REQUERIDO: Total de items en la BD
  has_next: boolean;       // ✅ REQUERIDO: Hay página siguiente
  has_prev: boolean;       // ✅ REQUERIDO: Hay página anterior
}
```

**Ejemplo de uso:**
```typescript
readonly meta = signal<PaginationMeta>({
  limit: 10,              // 10 items por página
  current_page: 1,        // Página 1
  total_pages: 5,         // 5 páginas en total
  total_items: 47,        // 47 productos en total
  has_next: true,         // Sí hay página siguiente
  has_prev: false         // No hay página anterior (estamos en la 1)
});
```

### TableAction (Acciones Contextuales)
```typescript
interface TableAction {
  label: string;                        // ✅ REQUERIDO: Texto del botón
  icon?: any;                           // ❌ OPCIONAL: Icono de Lucide
  variant?: 'default' | 'danger';       // ❌ OPCIONAL: Estilo (default: 'default')
  handler: (row: any) => void;          // ✅ REQUERIDO: Función a ejecutar
}
```

**Ejemplo de uso:**
```typescript
readonly tableActions: TableAction[] = [
  {
    label: 'Editar',                    // Texto del botón
    icon: Edit,                         // Icono de lucide-angular
    handler: (row) => this.editProduct(row)  // Función que se ejecuta
  },
  {
    label: 'Ver detalles',
    icon: Eye,
    handler: (row) => this.viewProduct(row)
  },
  {
    label: 'Eliminar',
    icon: Trash2,
    variant: 'danger',                  // Texto en rojo
    handler: (row) => this.deleteProduct(row)
  }
];
```

## 3. Propiedades del Componente (Inputs)

| Propiedad | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `dataSource` | `any[]` | ✅ | - | Array de datos a mostrar |
| `meta` | `PaginationMeta` | ✅ | - | Metadatos de paginación |
| `columns` | `TableColumn[]` | ✅ | - | Definición de columnas |
| `imageKey` | `string` | ❌ | `''` | Key para mostrar imágenes (ej: 'image_url') |
| `statusKey` | `string` | ❌ | `'is_available'` | Key para toggle de estado |
| `actions` | `TableAction[]` | ❌ | `[]` | Lista de acciones por fila |
| `showToggle` | `boolean` | ❌ | `false` | Muestra toggle de estado |
| `loading` | `boolean` | ❌ | `false` | Estado de carga |
| `emptyMessage` | `string` | ❌ | `'No hay datos disponibles'` | Mensaje cuando no hay datos |
| `mobileMaxFields` | `number` | ❌ | `3` | Máximo de campos a mostrar en mobile |

## 4. Eventos del Componente (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `rowClick` | `any` | Se dispara al hacer clic en una fila (solo desktop) |
| `toggleChange` | `{ row: any, enabled: boolean }` | Cambio en toggle de estado |
| `pageChange` | `number` | Cambio de página (emite el número de página) |

## Configuración de Pipes

### Pipes Soportados

| Pipe | Uso | pipeFormat (Ejemplos) | Resultado |
|------|-----|----------------------|-----------|
| `currency` | Formatear monedas | `'USD'`, `'EUR'`, `'PEN'` | $1,234.56 |
| `date` | Formatear fechas | `'dd/MM/yyyy'`, `'short'`, `'medium'` | 15/02/2024 |
| `number` | Formatear números | `'1.0-2'`, `'1.2-2'` | 1,234.56 |
| `percent` | Formatear porcentajes | `'1.0-2'` | 75.50% |
| `uppercase` | Convertir a mayúsculas | - | TEXTO |
| `lowercase` | Convertir a minúsculas | - | texto |

### Ejemplos de Configuración de Pipes

```typescript
readonly columns: TableColumn[] = [
  // Pipe de moneda
  { 
    key: 'price', 
    label: 'Precio',
    pipe: 'currency',
    pipeFormat: 'USD'       // Resultado: $1,234.56
  },
  
  // Pipe de fecha
  { 
    key: 'created_at', 
    label: 'Creado',
    pipe: 'date',
    pipeFormat: 'dd/MM/yyyy'  // Resultado: 15/02/2024
  },
  
  // Pipe de número
  { 
    key: 'quantity', 
    label: 'Cantidad',
    pipe: 'number',
    pipeFormat: '1.0-0'       // Resultado: 1,234
  },
  
  // Pipe de porcentaje
  { 
    key: 'discount', 
    label: 'Descuento',
    pipe: 'percent',
    pipeFormat: '1.0-2'       // Resultado: 15.50%
  },
  
  // Sin pipe (texto plano)
  { 
    key: 'name', 
    label: 'Nombre'
    // No se aplica ninguna transformación
  }
];
```

## Configuración Mobile

El componente permite configurar cómo se muestran las columnas en dispositivos móviles usando `mobileOrder`:

```typescript
readonly columns: TableColumn[] = [
  { 
    key: 'id', 
    label: 'ID',
    hideOnMobile: true          // ❌ No se muestra en mobile
  },
  { 
    key: 'name', 
    label: 'Producto',
    mobileOrder: 1              // 📱 Título principal (h3, negro, bold)
  },
  { 
    key: 'category', 
    label: 'Categoría',
    mobileOrder: 2              // 📱 Subtítulo (p, gris, normal)
  },
  { 
    key: 'price', 
    label: 'Precio',
    pipe: 'currency',
    pipeFormat: 'USD',
    mobileOrder: 3              // 📱 Metadata (span inline, agrupados)
  },
  { 
    key: 'stock', 
    label: 'Stock',
    mobileOrder: 4              // 📱 Metadata (span inline, agrupados)
  }
];
```

**Comportamiento Mobile:**
- `mobileOrder: 1` → **Título principal** (h3, text-sm, font-medium, text-gray-900)
- `mobileOrder: 2` → **Subtítulo** (p, text-xs, text-gray-500)
- `mobileOrder: 3+` → **Metadata** (span, text-xs, text-gray-900, agrupados en flex)
- `hideOnMobile: true` → No se muestra en mobile
- Sin `mobileOrder` → Orden por defecto (999), aparece al final

## Ejemplo Completo de Implementación

### 1. TypeScript Component (product-list-page.ts)

```typescript
import { Component, signal } from '@angular/core';
import { DataTable, TableColumn, TableAction, PaginationMeta } from '../../../../../shared/components/data-table/data-table';
import { Edit, Trash2, Eye } from 'lucide-angular';
import type { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-list-page',
  imports: [DataTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css'
})
export class ProductListPage {
  // 1. SIGNALS DE ESTADO (REQUERIDO)
  readonly loading = signal(false);
  readonly products = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta>({
    limit: 10,
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false
  });

  // 2. CONFIGURACIÓN DE COLUMNAS (REQUERIDO)
  readonly columns: TableColumn[] = [
    { 
      key: 'id',                    // ✅ Campo del objeto
      label: 'ID', 
      width: '120px',
      hideOnMobile: true            // No mostrar en mobile
    },
    { 
      key: 'name',                  // ✅ Campo del objeto
      label: 'Producto', 
      width: '250px',
      mobileOrder: 1                // Título en mobile
    },
    { 
      key: 'category_name',         // ✅ Campo del objeto
      label: 'Categoría', 
      width: '150px',
      mobileOrder: 2                // Subtítulo en mobile
    },
    { 
      key: 'price',                 // ✅ Campo del objeto
      label: 'Precio', 
      width: '120px', 
      align: 'right',
      pipe: 'currency',             // ✅ Pipe a aplicar
      pipeFormat: 'USD',            // ✅ Formato del pipe
      mobileOrder: 3                // Metadata en mobile
    },
    { 
      key: 'stock',                 // ✅ Campo del objeto
      label: 'Stock',
      width: '100px',
      align: 'center',
      pipe: 'number',               // ✅ Pipe a aplicar
      pipeFormat: '1.0-0',          // ✅ Sin decimales
      mobileOrder: 4                // Metadata en mobile
    },
    { 
      key: 'created_at',            // ✅ Campo del objeto
      label: 'Creado', 
      width: '150px',
      pipe: 'date',                 // ✅ Pipe a aplicar
      pipeFormat: 'dd/MM/yyyy',     // ✅ Formato de fecha
      hideOnMobile: true            // No mostrar en mobile
    }
  ];

  // 3. ACCIONES DE LA TABLA (OPCIONAL)
  readonly tableActions: TableAction[] = [
    {
      label: 'Editar',
      icon: Edit,
      handler: (row) => this.editProduct(row)
    },
    {
      label: 'Ver detalles',
      icon: Eye,
      handler: (row) => this.viewProduct(row)
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'danger',
      handler: (row) => this.deleteProduct(row)
    }
  ];

  // 4. LIFECYCLE HOOKS
  ngOnInit(): void {
    this.loadProducts(1, 10);
  }

  // 5. MÉTODOS DE CARGA DE DATOS
  private async loadProducts(page: number, limit: number): Promise<void> {
    this.loading.set(true);
    
    try {
      // Llamada a la API
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      // Actualizar signals
      this.products.set(data.data);
      this.meta.set(data.meta);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading.set(false);
    }
  }

  // 6. EVENT HANDLERS (REQUERIDOS si usas los eventos)
  onPageChange(page: number): void {
    this.loadProducts(page, this.meta().limit);
  }

  onProductClick(product: Product): void {
    console.log('Producto clickeado:', product);
    // Navegar a detalles o abrir modal
  }

  onToggleChange(event: { row: Product; enabled: boolean }): void {
    console.log('Cambio de estado:', event);
    // Actualizar disponibilidad en el servidor
    // this.productService.updateStatus(event.row.id, event.enabled);
  }

  // 7. ACTION HANDLERS (REQUERIDOS si usas acciones)
  private editProduct(product: Product): void {
    console.log('Editar producto:', product);
    // Navegar a formulario de edición
    // this.router.navigate(['/products/edit', product.id]);
  }

  private viewProduct(product: Product): void {
    console.log('Ver detalles:', product);
    // Mostrar modal o navegar a página de detalles
    // this.router.navigate(['/products', product.id]);
  }

  private deleteProduct(product: Product): void {
    console.log('Eliminar producto:', product);
    // Mostrar confirmación y eliminar
    // if (confirm('¿Eliminar producto?')) {
    //   this.productService.delete(product.id);
    // }
  }
}
```

### 2. Template HTML (product-list-page.html)

```html
<div class="container mx-auto p-6">
  <h1 class="text-2xl font-bold mb-6">Lista de Productos</h1>
  
  <!-- DataTable Component -->
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
    [mobileMaxFields]="4"
    (rowClick)="onProductClick($event)"
    (toggleChange)="onToggleChange($event)"
    (pageChange)="onPageChange($event)"
  />
</div>
```

## Formato de Respuesta de API Esperado

```json
{
  "status": "success",
  "code": "200",
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Laptop HP Pavilion",
      "category_name": "Computadoras",
      "price": 899.99,
      "stock": 15,
      "image_url": "https://example.com/laptop.jpg",
      "is_available": true,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Mouse Logitech MX",
      "category_name": "Accesorios",
      "price": 49.99,
      "stock": 50,
      "image_url": "https://example.com/mouse.jpg",
      "is_available": true,
      "created_at": "2024-01-16T14:20:00Z"
    }
  ],
  "meta": {
    "limit": 10,
    "current_page": 1,
    "total_pages": 5,
    "total_items": 47,
    "has_next": true,
    "has_prev": false
  }
}
```

## Checklist de Configuración ✅

Antes de usar el DataTable, asegúrate de tener:

### Configuración Mínima Requerida:
- [ ] Imports correctos: `DataTable`, `TableColumn`, `PaginationMeta`
- [ ] Signal de datos: `signal<any[]>([])`
- [ ] Signal de meta: `signal<PaginationMeta>({...})`
- [ ] Array de columns con `key` y `label`
- [ ] Handler para `pageChange` event

### Configuración Opcional:
- [ ] `imageKey` si tienes imágenes
- [ ] `statusKey` y `showToggle` si tienes toggles
- [ ] `TableAction[]` si tienes acciones
- [ ] Pipes configurados en columns (`pipe`, `pipeFormat`)
- [ ] `mobileOrder` en columns para mobile
- [ ] `hideOnMobile` para columnas que no se ven en mobile

## Tips y Mejores Prácticas

### 1. Uso de Pipes
✅ **CORRECTO:**
```typescript
{ 
  key: 'price', 
  label: 'Precio',
  pipe: 'currency',
  pipeFormat: 'USD'
}
```

❌ **INCORRECTO (No usar render para pipes nativos):**
```typescript
{ 
  key: 'price', 
  label: 'Precio',
  render: (value) => `$${Number(value).toFixed(2)}`  // ❌ No hacer esto
}
```

### 2. Configuración Mobile
- Siempre define `mobileOrder` para las 3-4 columnas más importantes
- Usa `hideOnMobile: true` para columnas técnicas (ID, timestamps)
- El primer campo (`mobileOrder: 1`) debe ser descriptivo

### 3. Paginación
- Siempre maneja la paginación en el backend
- Actualiza `meta` después de cada carga de datos
- El componente solo emite eventos, no maneja la lógica

### 4. Performance
- Usa signals para `dataSource`, `meta`, `loading`
- El componente ya tiene `ChangeDetectionStrategy.OnPush`
- El `trackBy` ya está implementado

### 5. Acciones
- Usa `variant: 'danger'` para acciones destructivas
- Implementa confirmaciones para delete
- Las acciones reciben el row completo

## Troubleshooting

### Las columnas no se muestran
- ✅ Verifica que `key` coincida con el campo del objeto
- ✅ Revisa que `columns` esté definido correctamente

### Los pipes no funcionan
- ✅ Asegúrate de importar `CommonModule` en DataTable
- ✅ Verifica que `pipe` y `pipeFormat` estén bien escritos

### La paginación no funciona
- ✅ Implementa el handler `onPageChange`
- ✅ Actualiza `meta` después de cargar datos
- ✅ Verifica que `meta` tenga todos los campos

### El mobile no se ve bien
- ✅ Define `mobileOrder` en las columnas importantes
- ✅ Ajusta `mobileMaxFields` si es necesario
- ✅ Usa `hideOnMobile` para columnas no esenciales