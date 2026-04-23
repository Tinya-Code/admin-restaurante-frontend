import { Category } from './category.model';
import { Product } from './product.model';
import { Combo } from './combo.model';

export type SearchResultType = 'products' | 'categories' | 'combos' | 'all';

export type SearchResultProduct = Product & { type: 'product' };
export type SearchResultCategory = Category & { type: 'category' };
export type SearchResultCombo = Combo & { type: 'combo' };

export type SearchResult = SearchResultProduct | SearchResultCategory | SearchResultCombo;

export interface SearchParams {
  q: string;
  type?: SearchResultType;
  menu_id?: string;
  page?: number;
  limit?: number;
}
