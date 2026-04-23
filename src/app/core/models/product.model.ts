export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  cloudinary_id?: string;
  is_available: boolean;
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
}

// (POST) Crear producto
export type ProductCreate = Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  image_base64?: string;
};

// (PATCH) Actualización parcial
export type ProductPatch = Partial<Omit<Product, 'created_at' | 'updated_at'>> & {
  image_base64?: string;
};

// (PUT) Actualización completa
export type ProductUpdate = Omit<Product,  'created_at' | 'updated_at'> & {
  image_base64?: string;
};

// (GET) Listado simple
export type ProductList = Product[];
