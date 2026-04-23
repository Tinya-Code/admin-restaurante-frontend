export interface CategoryType {
  id: string;
  name: string;
  metadata?: {
    section: number;
    suggestions: string[];
  };
}

export interface Category {
  id: string;
  menu_id: string;
  branch_id: string;
  type_id: string | null;
  type_name?: string;
  name: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
// (POST)
export type CategoryCreate = Omit<Category, 'id' | 'created_at' | 'updated_at' | 'display_order' | 'branch_id' | 'menu_id' | 'type_id'> & {
  type_id?: string | null;
  display_order?: number;
  menu_id?: string;
};

// (PATCH)
export type CategoryUpdate = Partial<
  Omit<Category, 'id' | 'branch_id' | 'created_at' | 'updated_at' | 'type_id'>
> & {
  type_id?: string | null;
};

// (GET)
export type CategoryList = Category[];
