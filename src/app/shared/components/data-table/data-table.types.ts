/**
 * Tipos base del componente DataTable
 * Compatible con Angular 17+ (signals + standalone)
 */

/** Columna de la tabla */
export interface DataTableColumn<T = any> {
  /** Clave del campo (propiedad del objeto) */
  key: keyof T;

  /** Título visible de la columna */
  label: string;

  /** Si permite ordenamiento */
  sortable?: boolean;

  /** Tipo de dato (para renderizado especial) */
  type?: 'text' | 'status' | 'date' | 'custom';

  /** Formateador opcional del valor */
  formatter?: (value: any, row: T) => string | number | boolean | null;
}

/** Configuración de la tabla */
export interface DataTableConfig<T = any> {
  /** Título opcional */
  title?: string;

  /** Columnas visibles */
  columns: DataTableColumn<T>[];

  /** Datos a mostrar */
  data: T[];

  /** Paginación */
  pagination?: boolean;

  /** Página actual (1-based) */
  currentPage?: number;

  /** Elementos por página */
  pageSize?: number;

  /** Total de elementos (para paginación) */
  totalItems?: number;
}

/** Tipos de evento del DataTable */
export type DataTableEventType = 'sort' | 'page' | 'select';

/** Estructura del evento emitido por el DataTable */
export interface DataTableEvent<T = any> {
  /** Tipo del evento */
  type: DataTableEventType;

  /** Datos asociados */
  data: {
    /** Para sort */
    column?: keyof T;
    direction?: 'asc' | 'desc';

    /** Para paginación */
    page?: number;

    /** Para selección */
    row?: T;
  };
}