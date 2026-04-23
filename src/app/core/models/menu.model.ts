export interface Menu {
  id: string;
  branch_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCreate {
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export interface MenuUpdate extends Partial<MenuCreate> {}
