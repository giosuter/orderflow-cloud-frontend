import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order, OrderStatus } from './order.model';

/**
 * OrderService is the single entry point for talking to the OrderFlow API
 * from the Angular frontend.
 *
 * It hides the concrete URLs and uses environment.apiBaseUrl so that:
 *  - on localhost (dev) it calls http://localhost:8080/orderflow-api/api/...
 *  - on Hostpoint (prod) it calls https://devprojects.ch/orderflow-api/api/...
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  /**
   * Base URL for all order-related calls.
   *
   * environment.apiBaseUrl is defined in:
   *  - src/environments/environment.development.ts  (dev)
   *  - src/environments/environment.ts              (prod)
   *
   * For example (dev):
   *   apiBaseUrl = 'http://localhost:8080/orderflow-api/api'
   *
   * So this baseUrl becomes:
   *   'http://localhost:8080/orderflow-api/api/orders'
   */
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private readonly http: HttpClient) {}

  /**
   * GET /api/orders
   *
   * Returns all orders as an array.
   */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /**
   * GET /api/orders/{id}
   *
   * Fetch a single order by its technical id.
   */
  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /api/orders/search?code=...&status=...
   *
   * Search orders by optional code substring and status.
   * Both parameters are optional to match the backend controller.
   */
  search(code?: string, status?: OrderStatus): Observable<Order[]> {
    const params: Record<string, string> = {};

    if (code) {
      params['code'] = code;
    }
    if (status) {
      params['status'] = status;
    }

    return this.http.get<Order[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * POST /api/orders
   *
   * Create a new order. Backend returns the created entity (with id, timestamps).
   */
  create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  /**
   * PUT /api/orders/{id}
   *
   * Update an existing order (id in the URL, body without id).
   */
  update(id: number, order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  /**
   * DELETE /api/orders/{id}
   *
   * Delete an order. Backend returns 204 No Content on success.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}