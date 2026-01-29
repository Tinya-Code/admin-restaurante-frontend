export interface Category {
  id: string;              
  restaurant_id: string;   
  name: string;
  is_active: boolean;
  created_at: string;      
  update_at: string;       
};
// (POST) 
export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'update_at'>;

// (PATCH) 
export type CategoryPatch = Partial<Omit<Category, 'id' | 'restaurant_id' | 'created_at' | 'update_at'>>;

// (PUT) 
export type CategoryUpdate = Omit<Category, 'created_at' | 'update_at'>;

// (GET)
export type CategoryList = Category[];
