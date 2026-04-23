export interface ComboProduct {
  product_id: string;
  name?: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  cloudinary_id?: string;
  is_active: boolean;
  products: ComboProduct[];
  created_at?: string;
  updated_at?: string;
}

export interface ComboCreate {
  name: string;
  description?: string;
  price: number;
  image_base64?: string;
  products: { product_id: string; quantity: number }[];
}

export interface ComboUpdate extends Partial<Omit<ComboCreate, 'image_base64'>> {
  image_base64?: string;
  is_active?: boolean;
}
