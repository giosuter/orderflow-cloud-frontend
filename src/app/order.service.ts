// Path: src/app/order.service.ts
// Central Angular service for talking to the OrderFlow backend.
//
// CURRENT backend contract used by Orders list paging:
//   GET  /orderflow-api/api/orders/search?customer=&status=&page=&size=
// Returns OrdersPageResponse (content + pagination metadata)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order, OrderStatus } from './order.model';
import { OrdersPageResponse } from './orders-page-response.model';

/**
 * Payload when creating a new order from the UI.
 * The backend will generate id / timestamps.
 */
export interface CreateOrderPayload {
  code: string;
  status?: OrderStatus;
  customerName: string;
  total: number;
}

/**
 * Payload when updating an existing order.
 */
export interface UpdateOrderPayload {
  code: string;
  status?: OrderStatus;
  customerName: string;
  total: number;
}

/**
 * Parameters for the old (non-paged) search endpoint.
 * Keep only if your backend still supports returning a plain list.
 */
export interface OrderSearchParams {
  code?: string;
  status?: OrderStatus;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  /**
   * Base URL of the backend API.
   * Example in prod: '/orderflow-api/api'
   */
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get ALL orders (no filters).
   * Maps to GET /api/orders
   */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  /**
   * Old-style search (no pagination). Keep only if backend returns a list.
   * Maps to GET /api/orders/search?code=...&status=...
   */
  search(params: OrderSearchParams): Observable<Order[]> {
    let httpParams = new HttpParams();

    if (params.code && params.code.trim() !== '') {
      httpParams = httpParams.set('code', params.code.trim());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<Order[]>(`${this.baseUrl}/orders/search`, {
      params: httpParams,
    });
  }

  /**
   * Paged search used by the Orders list page.
   *
   * IMPORTANT:
   * Your backend uses query param "customer" as a general term that matches
   * both code and customerName.
   */
  searchPaged(
    term: string | null,
    status: OrderStatus | null,
    page: number,
    size: number,
  ): Observable<OrdersPageResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    if (term && term.trim() !== '') {
      params = params.set('customer', term.trim());
    }

    if (status) {
      // IMPORTANT: backend expects a string like "NEW"
      params = params.set('status', status);
    }

    return this.http.get<OrdersPageResponse>(`${this.baseUrl}/orders/search`, {
      params,
    });
  }

  /**
   * Load a single order by id.
   * Maps to GET /api/orders/{id}
   */
  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  /**
   * Create new order.
   * Maps to POST /api/orders
   */
  create(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, payload);
  }

  /**
   * Update existing order.
   * Maps to PUT /api/orders/{id}
   */
  update(id: number, payload: UpdateOrderPayload): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${id}`, payload);
  }

  /**
   * Delete order by id.
   * Maps to DELETE /api/orders/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`);
  }
}