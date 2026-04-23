export type PromotionDiscountType = 'percentage' | 'fixed';
export type PromotionAppliesTo = 'product' | 'category' | 'combo' | 'branch';

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  discount_type: PromotionDiscountType;
  discount_value: number;
  applies_to: PromotionAppliesTo;
  target_id?: string;
  target_name?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PromotionCreate {
  name: string;
  description?: string;
  discount_type: PromotionDiscountType;
  discount_value: number;
  applies_to: PromotionAppliesTo;
  target_id?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface PromotionUpdate extends Partial<PromotionCreate> {}
