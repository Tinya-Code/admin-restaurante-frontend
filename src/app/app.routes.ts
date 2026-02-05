import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page').then(m => m.LoginPage),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/admin/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPage),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/pages/product-list-page/product-list-page').then(m => m.ProductListPage),
      },
      {
        path: 'product-form',
        loadComponent: () =>
          import('./features/admin/products/pages/product-form-page/product-form-page').then(m => m.ProductFormPage),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/pages/category-list-page/category-list-page').then(m => m.CategoryListPage),
      },
      {
        path: 'category-form',
        loadComponent: () =>
          import('./features/admin/categories/pages/category-form-page/category-form-page').then(m => m.CategoryFormPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/configuration/pages/configuration-page/configuration-page').then(m => m.ConfigurationPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
