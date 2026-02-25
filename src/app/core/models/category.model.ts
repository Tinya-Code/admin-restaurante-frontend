export interface Category {
  id: string;
  restaurant_id: string;
  menu_id: string;
  name: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  update_at: string;
}
// (POST)
export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'update_at' | 'display_order'> & {
  display_order?: number; // Opcional en el DTO, se omite si el usuario no lo proporciona
};

// (PATCH)
export type CategoryPatch = Partial<
  Omit<Category, 'id' | 'restaurant_id' | 'created_at' | 'update_at'>
>;

// (PUT)
export type CategoryUpdate = Omit<Category, 'created_at' | 'update_at'>;

// (GET)
export type CategoryList = Category[];
