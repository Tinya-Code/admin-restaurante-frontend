import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [publicGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'auth/select-restaurant',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/pages/select-restaurant/select-restaurant').then(
        (m) => m.SelectRestaurantPage
      ),
  },
  {
    path: 'admin',
canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/admin/dashboard/pages/dashboard-page/dashboard-page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'menu',
        children: [
          {
            path: 'products',
            loadComponent: () =>
              import('./features/admin/products/pages/product-list-page/product-list-page').then(
                (m) => m.ProductListPage
              ),
          },
          {
            path: 'product-form',
            loadComponent: () =>
              import('./features/admin/products/pages/product-form-page/product-form-page').then(
                (m) => m.ProductFormPage
              ),
          },
          {
            path: 'product-form/:id',
            loadComponent: () =>
              import('./features/admin/products/pages/product-form-page/product-form-page').then(
                (m) => m.ProductFormPage
              ),
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./features/admin/categories/pages/category-list-page/category-list-page').then(
                (m) => m.CategoryListPage
              ),
          },
          {
            path: 'category-form',
            loadComponent: () =>
              import('./features/admin/categories/pages/category-form-page/category-form-page').then(
                (m) => m.CategoryFormPage
              ),
          },
          {
            path: 'category-form/:id',
            loadComponent: () =>
              import('./features/admin/categories/pages/category-form-page/category-form-page').then(
                (m) => m.CategoryFormPage
              ),
          },
          { path: '', redirectTo: 'products', pathMatch: 'full' },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: 'business-profile',
            loadComponent: () =>
              import('./features/admin/settings/pages/business-profile/business-profile').then(
                (m) => m.BusinessProfilePage
              ),
          },
          {
            path: 'operational',
            loadComponent: () =>
              import('./features/admin/settings/pages/operational-settings/operational-settings').then(
                (m) => m.OperationalSettingsPage
              ),
          },
          { path: '', redirectTo: 'business-profile', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { 
    path: '**', 
    loadComponent: () => import('./core/pages/not-found-page/not-found-page').then((m) => m.NotFoundPage) 
  },
];
