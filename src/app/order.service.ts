import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order } from './order.model';

type SortDir = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  /**
   * We want the frontend to always call:
   *   /orderflow-api/api/orders
   *
   * With proxy.conf.json, environment.apiBaseUrl should be '' so this becomes a relative URL.
   */
  private readonly baseUrl = `${environment.apiBaseUrl}/orderflow-api/api/orders`;

  list(page = 0, size = 10, sortBy = 'id', sortDir: SortDir = 'desc'): Observable<Order[]> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sortBy', String(sortBy))
      .set('sortDir', String(sortDir));

    return this.http.get<Order[]>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<Order>): Observable<Order> {
    // Backend uses "description" (or "comment" depending on your DTO).
    // Here we send BOTH to be safe during the transition.
    const body: any = {
      code: payload.code ?? '',
      status: payload.status ?? 'NEW',
      customerName: payload.customerName ?? null,
      total: payload.total ?? 0,
      description: (payload as any).description ?? (payload as any).comment ?? null,
      comment: (payload as any).comment ?? (payload as any).description ?? null,
    };

    return this.http.post<Order>(this.baseUrl, body);
  }

  update(id: number, payload: Partial<Order>): Observable<Order> {
    const body: any = {
      code: payload.code ?? '',
      status: payload.status ?? 'NEW',
      customerName: payload.customerName ?? null,
      total: payload.total ?? 0,
      description: (payload as any).description ?? (payload as any).comment ?? null,
      comment: (payload as any).comment ?? (payload as any).description ?? null,
    };

    return this.http.put<Order>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}