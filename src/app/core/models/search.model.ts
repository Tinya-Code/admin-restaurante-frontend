import { Category } from './category.model';
import { Product } from './product.model';

export type SearchResultType = 'products' | 'categories' | 'all';

export interface SearchResultItemBase {
  type: 'product' | 'category';
}

export type SearchResultProduct = Product & { type: 'product' };
export type SearchResultCategory = Category & { type: 'category' };

export type SearchResult = SearchResultProduct | SearchResultCategory;

export interface SearchParams {
  q: string;
  type?: SearchResultType;
  menu_id?: string;
  page?: number;
  limit?: number;
}
