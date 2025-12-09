// Central Angular service for talking to the OrderFlow backend.
// It provides list/search, load-by-id, create, update and delete.
//
// IMPORTANT:
//  - List all orders:        GET  /orderflow-api/api/orders
//  - Search with filters:    GET  /orderflow-api/api/orders/search?code=&status=
//  - Load single order:      GET  /orderflow-api/api/orders/{id}
//  - Create new order:       POST /orderflow-api/api/orders
//  - Update existing order:  PUT  /orderflow-api/api/orders/{id}
//  - Delete order:           DELETE /orderflow-api/api/orders/{id}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order, OrderStatus } from './order.model';

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
 * Same shape as the editable subset of Order,
 * without id / createdAt / updatedAt.
 */
export interface UpdateOrderPayload {
  code: string;
  status?: OrderStatus;
  customerName: string;
  total: number;
}

/**
 * Parameters for the search endpoint.
 * All fields are optional; if omitted, the backend
 * should treat them as "no filter".
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
   * In dev this should be something like '/orderflow-api/api',
   * proxied by Angular dev-server; in prod it should hit Tomcat.
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
   * Search orders via the dedicated backend search endpoint.
   * Maps to:
   *   GET /api/orders/search?code=...&status=...
   *
   * Only sends query parameters that are actually present.
   */
  search(params: OrderSearchParams): Observable<Order[]> {
    let httpParams = new HttpParams();

    if (params.code && params.code.trim() !== '') {
      httpParams = httpParams.set('code', params.code.trim());
    }

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<Order[]>(
      `${this.baseUrl}/orders/search`,
      { params: httpParams },
    );
  }
  
  /**
   * Create a new order.
   * Maps to POST /api/orders
   */
  create(payload: CreateOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, payload);
  }

  /**
   * Update an existing order.
   * Maps to PUT /api/orders/{id}
   */
  update(id: number, payload: any) {
    return this.http.put<any>(`${this.baseUrl}/orders/${id}`, payload);
  }

  /**
   * Delete an order by id.
   * Maps to DELETE /api/orders/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`);
  }

  /**
   * Load a single order by its ID.
   * Used by OrderDetailComponent and OrderEditComponent.
   */
  findById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }
}