// -------------------------------------------------------
// Response shapes for GET /statistics/* endpoints
// -------------------------------------------------------

/** GET /statistics/products/count */
export interface ProductsCountData {
  branch_id: string;
  total_products: number;
}

/** GET /statistics/categories/count */
export interface CategoriesCountData {
  branch_id: string;
  total_categories: number;
}

/** GET /statistics/combos/count */
export interface CombosCountData {
  branch_id: string;
  total_combos: number;
}

/** Single item inside RecentProductsData.products */
export interface RecentProductItem {
  id: string;
  name: string;
  price: number;
  category_id: string;
  created_at: string;
}

/** GET /statistics/products/recent */
export interface RecentProductsData {
  branch_id: string;
  products: RecentProductItem[];
}

/** Single breakdown entry for VisitsOverviewData */
export interface VisitBreakdownItem {
  type: 'view' | 'checkin' | 'order' | 'favorite';
  count: number;
}

/** GET /statistics/visits/overview */
export interface VisitsOverviewData {
  branch_id: string;
  total_visits: number;
  breakdown: VisitBreakdownItem[];
}

/** Aggregated snapshot used inside DashboardService */
export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalCombos: number;
  recentProducts: RecentProductItem[];
  visitsOverview: VisitsOverviewData | null;
}
