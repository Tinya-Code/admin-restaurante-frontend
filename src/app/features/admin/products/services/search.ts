import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../../../core/http/api';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Product } from '../../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  
  constructor(private api: Api) {}

  /**
   * Buscar productos con filtros múltiples
   * @param params Parámetros de búsqueda
   * @returns Observable<ApiResponse<Product[]>>
   */
  searchProducts(params: {
    category?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<Product[]>> {
    // Construir query params
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() ? `/search/products?${queryParams}` : '/search/products';
    
    return this.api.get<Product[]>(url);
  }

  /**
   * Buscar categorías del usuario
   * @returns Observable<ApiResponse<Category[]>>
   */
  searchCategories(): Observable<ApiResponse<any[]>> {
    return this.api.get<any[]>('/search/categories');
  }
}

/* 
  🔍 ANÁLISIS DE ARQUITECTURA - SERVICIO DE BÚSQUEDA
  
  📋 PROBLEMAS IDENTIFICADOS:
  1. getProduct() está en product-list-page.ts ❌ → Debería estar aquí ✅
  2. Lógica de búsqueda dispersa ❌ → Debería centralizarse aquí ✅
  3. CategoryList carga sus propios datos ❌ → Debería usar este servicio ✅
  4. Falta separación de responsabilidades ❌ → Validación + API + Procesamiento ✅

  🏗️ ARQUITECTURA IDEAL:
  
  SearchService (Aquí):
  ├── validateSearchParams()    ← Validar inputs
  ├── searchProducts()         ← Llamada API
  ├── processSearchResponse()  ← Procesar respuesta
  └── searchCategories()       ← Búsqueda de categorías

  ProductListPage:
  ├── loadProducts()           ← Orquestar flujo
  ├── updatePagination()       ← Manejar paginación
  └── handleUserActions()      ← Eventos UI

  CategoryList:
  ├── onCategoryChange()       ← Emitir eventos
  └── displayCategories()      ← Solo UI (dumb component)

  📊 FLUJO IDEAL:
  1. User interaction → ProductListPage
  2. ProductListPage → SearchService.searchProducts()
  3. SearchService → API call
  4. API response → SearchService.processResponse()
  5. Processed data → ProductListPage.updateUI()
  6. UI update → User sees results

  🎯 BENEFICIOS:
  ✅ Centralización de lógica de búsqueda
  ✅ Reutilización en otros componentes
  ✅ Testing más fácil
  ✅ Mantenimiento simplificado
  ✅ Separación clara de responsabilidades
*/