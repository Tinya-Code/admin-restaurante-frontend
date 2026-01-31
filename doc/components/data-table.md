# DataTable Component

Componente genérico y reutilizable para mostrar datos tabulares con paginación, desarrollado con Angular 20+ y el sistema de signals.

## 📋 Interfaces

### TableColumn
```typescript
interface TableColumn {
  key: string;                                    // Clave del campo en el objeto
  label: string;                                  // Texto del encabezado
  sortable?: boolean;                             // Si la columna es ordenable (futuro)
  width?: string;                                 // Ancho de columna ('200px', '20%', 'auto')
  align?: 'left' | 'center' | 'right';           // Alineación del texto
  render?: (value: any, row: any) => string;     // Función de renderizado personalizada
}
```

### PaginationConfig
```typescript
interface PaginationConfig {
  pageSize: number;           // Tamaño de página inicial
  pageSizeOptions: number[];  // Opciones disponibles
}
```

## 🔧 Inputs (propiedades que recibe el componente)

- **dataSource**: un arreglo de datos que se van a mostrar en la tabla.  
- **columns**: la configuración de las columnas (qué campos mostrar, títulos, etc.).  
- **pagination** *(opcional)*: cómo se maneja la paginación.  
  - Por defecto muestra 10 elementos por página.  
  - Permite elegir entre 10, 25, 50 o 100.  
- **loading** *(opcional)*: un valor booleano que indica si la tabla está cargando datos.  
  - Por defecto es `false`.  
- **emptyMessage** *(opcional)*: el mensaje que se muestra cuando no hay datos.  
  - Por defecto es `"No hay datos disponibles"`.  

---

## 📤 Outputs (eventos que emite el componente)

- **rowClick**: se dispara cuando el usuario hace clic en una fila y devuelve el objeto de esa fila.  


## 📖 Ejemplos de Uso

### Ejemplo 1: Tabla básica de usuarios
```typescript
// users.component.ts
import { Component, signal } from '@angular/core';
import { DataTable, TableColumn } from '@/shared/components/data-table/data-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DataTable],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-light mb-6">Usuarios</h1>
      
      <app-data-table
        [dataSource]="users()"
        [columns]="columns"
        [loading]="loading()"
        (rowClick)="onUserClick($event)"
      />
    </div>
  `
})
export class UsersComponent {
  loading = signal(false);
  
  users = signal<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Pedro López', email: 'pedro@example.com', role: 'User', status: 'inactive' },
  ]);

  columns: TableColumn[] = [
    { 
      key: 'id', 
      label: 'ID', 
      width: '80px',
      align: 'center'
    },
    { 
      key: 'name', 
      label: 'Nombre',
      width: '200px'
    },
    { 
      key: 'email', 
      label: 'Correo Electrónico'
    },
    { 
      key: 'role', 
      label: 'Rol',
      width: '120px'
    },
    { 
      key: 'status', 
      label: 'Estado',
      width: '100px',
      align: 'center',
      render: (value) => value === 'active' ? 'Activo' : 'Inactivo'
    },
  ];

  onUserClick(user: User): void {
    console.log('Usuario clickeado:', user);
    // Navegar a detalle, editar, etc.
  }
}
```

### Ejemplo 2: Tabla de productos con paginación personalizada
```typescript
// products.component.ts
import { Component, signal, OnInit } from '@angular/core';
import { DataTable, TableColumn } from '@/shared/components/data-table/data-table';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [DataTable],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-light mb-6">Productos</h1>
      
      <app-data-table
        [dataSource]="products()"
        [columns]="columns"
        [pagination]="paginationConfig"
        [loading]="loading()"
        [emptyMessage]="'No se encontraron productos'"
        (rowClick)="onProductClick($event)"
      />
    </div>
  `
})
export class ProductsComponent implements OnInit {
  loading = signal(false);
  products = signal<Product[]>([]);

  paginationConfig = {
    pageSize: 25,
    pageSizeOptions: [25, 50, 100]
  };

  columns: TableColumn[] = [
    { 
      key: 'id', 
      label: 'SKU', 
      width: '120px'
    },
    { 
      key: 'name', 
      label: 'Producto',
      width: '300px'
    },
    { 
      key: 'category', 
      label: 'Categoría',
      width: '150px'
    },
    { 
      key: 'price', 
      label: 'Precio',
      width: '120px',
      align: 'right',
      render: (value) => `$${value.toFixed(2)}`
    },
    { 
      key: 'stock', 
      label: 'Stock',
      width: '100px',
      align: 'center',
      render: (value) => value > 0 ? `${value}` : 'Agotado'
    },
    { 
      key: 'status', 
      label: 'Estado',
      width: '100px',
      align: 'center',
      render: (value) => value === 'active' ? '✓ Activo' : '✗ Inactivo'
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading.set(true);
    
    try {
      // Simulación de llamada al backend
      const response = await fetch('/api/products');
      const data = await response.json();
      this.products.set(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onProductClick(product: Product): void {
    console.log('Producto clickeado:', product);
    // Navegar a detalle del producto
  }
}