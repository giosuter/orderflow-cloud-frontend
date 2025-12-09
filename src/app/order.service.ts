/**
 *
 * Service responsible for talking to the Order REST API.
 *
 * IMPORTANT:
 *  - This version is adapted to your existing components:
 *      - order-detail.component.ts uses: getById(id)
 *      - order-new.component.ts   uses: create(order)
 *  - We keep the method names they already expect.
 *  - We use flexible types (Partial<Order>) so the TS compiler
 *    does not complain if some fields (like status) are initially missing.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  /**
   * Base URL for all order endpoints.
   *
   * Expected values:
   *  - Dev:  http://localhost:8080/orderflow-api/api
   *  - Prod: https://devprojects.ch/orderflow-api/api
   *
   * The backend maps orders to /api/orders, so here we add /orders.
   */
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Load all orders (used by the list component).
   *
   * GET /orderflow-api/api/orders
   */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /**
   * Alias for getAll(), in case some component uses getOrders().
   */
  getOrders(): Observable<Order[]> {
    return this.getAll();
  }

  /**
   * Load a single order by ID (used by the detail/edit component).
   *
   * GET /orderflow-api/api/orders/{id}
   */
  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new order (used by order-new.component.ts).
   *
   * POST /orderflow-api/api/orders
   *
   * We accept Partial<Order> to avoid TypeScript errors when the
   * caller does not set all fields (e.g. status initially undefined).
   * The backend is responsible for validating required fields.
   */
  create(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  /**
   * Update an existing order (used by order-edit.component.ts).
   *
   * PUT /orderflow-api/api/orders/{id}
   *
   * We expect the caller to pass an object that at least contains "id".
   * Other fields may be partial (e.g. only some fields changed).
   */
update(id: number, order: Partial<Order>): Observable<Order> {
  return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
}

  /**
   * Delete an order by ID (for future use: delete buttons).
   *
   * DELETE /orderflow-api/api/orders/{id}
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}