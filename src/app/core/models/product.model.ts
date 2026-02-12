export interface Product {
  id: string;             
  category_name?: string;
  category_id?:string;    
  name: string;
  description?: string;     
  price: number;
  image_url?: string;    
  is_available: boolean;
  created_at: string;     
  updated_at: string;       
}

// (POST) Crear producto
export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

// (PATCH) Actualización parcial
export type ProductPatch = Partial<Omit<Product, 'id'|'category_id' | 'category_name' | 'created_at' | 'updated_at'>>;

// (PUT) Actualización completa
export type ProductUpdate = Omit<Product, 'created_at' | 'updated_at'>;

// (GET) Listado simple
export type ProductList = Product[];
