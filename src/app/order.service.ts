import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order } from './order.model';

export interface PageResponse<T> {
  content: T[];
  number: number;         // 0-based page index
  size: number;           // page size
  totalElements: number;  // total rows
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /**
   * Your environment has: { production: boolean; apiBaseUrl: string; }
   * In dev with proxy, apiBaseUrl is typically '' (empty) OR something like '/orderflow-api'.
   */
  private readonly baseUrl = `${environment.apiBaseUrl}/api/orders`;

  list(page = 0, size = 10, sortBy = 'id', sortDir: 'asc' | 'desc' = 'desc'): Observable<Order[]> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<Order[]>(this.baseUrl, { params });
  }

  /**
   * Use only if backend returns Spring Page<T>.
   * If backend returns an array (as your curl showed earlier), don't call this method.
   */
  listPaged(
    q: string,
    page = 0,
    size = 10,
    sortBy = 'id',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Observable<PageResponse<Order>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (q && q.trim().length > 0) {
      params = params.set('q', q.trim());
    }

    return this.http.get<PageResponse<Order>>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  create(body: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, body);
  }

  update(id: number, body: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, body);
  }

  /** canonical delete */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** compatibility with your OrdersListComponent */
  deleteById(id: number): Observable<void> {
    return this.delete(id);
  }
}