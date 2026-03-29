import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { Api } from '../http/api';
import { EndpointsService } from '../constants/endpoints';
import { ApiResponse } from '../models/api-response.model';
import { SearchParams, SearchResult } from '../models/search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly api = inject(Api);
  private readonly endpoints = inject(EndpointsService);

  // Cache state
  private readonly _cache = signal<ApiResponse<SearchResult[]> | null>(null);
  private readonly _lastParams = signal<string>('');

  public readonly cache = this._cache.asReadonly();

  checkCache(params?: any): boolean {
    const paramString = JSON.stringify(params || {});
    return !!this._cache() && this._lastParams() === paramString;
  }

  search(params: SearchParams): Observable<ApiResponse<SearchResult[]>> {
    const paramString = JSON.stringify(params || {});

    if (this._cache() && this._lastParams() === paramString) {
      return of(this._cache()!);
    }

    return this.api.get<SearchResult[]>(this.endpoints.search(), {
      params: params as any,
    }).pipe(
      map(response => {
        if (response.meta) {
          const anyMeta = response.meta as any;
          response.meta = {
            limit: anyMeta.limit ?? 10,
            current_page: anyMeta.page ?? anyMeta.current_page ?? 1,
            total_pages: anyMeta.totalPages ?? anyMeta.total_pages ?? 1,
            total_items: anyMeta.total ?? anyMeta.total_items ?? 0,
            has_next: (anyMeta.page ?? anyMeta.current_page ?? 1) < (anyMeta.totalPages ?? anyMeta.total_pages ?? 1),
            has_prev: (anyMeta.page ?? anyMeta.current_page ?? 1) > 1,
          };
        }
        return response;
      }),
      tap(response => {
        this._cache.set(response);
        this._lastParams.set(paramString);
      })
    );
  }

  clearCache(): void {
    this._cache.set(null);
    this._lastParams.set('');
  }
}
