import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Api } from '../http/api';
import { EndpointsService } from '../constants/endpoints';
import { ApiResponse } from '../models/api-response.model';
import { SearchParams, SearchResult } from '../models/search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private api = inject(Api);
  private endpoints = inject(EndpointsService);

  search(params: SearchParams): Observable<ApiResponse<SearchResult[]>> {
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
      })
    );
  }
}
