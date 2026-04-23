export interface Banner {
  id: string;
  image_url: string;
  cloudinary_id?: string;
  link_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BannerCreate {
  image_base64: string;
  link_url?: string;
  description?: string;
  display_order: number;
}

export interface BannerUpdate {
  description?: string;
  display_order?: number;
  is_active?: boolean;
}
